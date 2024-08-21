#!/bin/bash

# Function to detect the operating system
detect_os() {
    case "$(uname -s)" in
        Linux*)     OS=Linux;;
        Darwin*)    OS=Mac;;
        CYGWIN*|MINGW*|MSYS*) OS=Windows;;
        *)          OS="UNKNOWN:${unameOut}"
    esac
    echo "Detected OS: $OS"
}

# Update package lists
update_package_lists() {
    echo "Updating package lists..."
    if [[ "$OS" == "Linux" ]]; then
        sudo apt-get update -y
    elif [[ "$OS" == "Mac" ]]; then
        brew update
    elif [[ "$OS" == "Windows" ]]; then
        echo "Package list update is not required for Windows"
    else
        echo "Unsupported OS: $OS"
        exit 1
    fi
}

# Install curl
install_curl() {
    echo "Installing curl..."
    if [[ "$OS" == "Linux" ]]; then
        sudo apt-get install curl -y
    elif [[ "$OS" == "Mac" ]]; then
        brew install curl
    elif [[ "$OS" == "Windows" ]]; then
        echo "Please install curl manually on Windows."
        exit 1
    fi
}

# Install NVM, Node.js, and npm
install_node_nvm() {
    echo "Installing NVM, Node.js, and npm..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

    # Load NVM
    export NVM_DIR="$HOME/.nvm"
    source "$NVM_DIR/nvm.sh"

    # Install Node.js and npm using NVM
    nvm install node
    nvm use node
    nvm alias default node

    # Verify installation
    echo "Node.js version: $(node -v)"
    echo "npm version: $(npm -v)"
}

# Install Python and pip
install_python() {
    echo "Installing Python..."
    if [[ "$OS" == "Linux" ]]; then
        sudo apt-get install python3 python3-pip -y
    elif [[ "$OS" == "Mac" ]]; then
        brew install python3
    elif [[ "$OS" == "Windows" ]]; then
        echo "Please install Python 3 and pip manually on Windows."
        echo "You can download Python from https://www.python.org/downloads/"
        exit 1
    fi

    # Verify installation
    echo "Python version: $(python3 --version)"
    echo "pip version: $(pip3 --version)"
}

# Install virtualenv
install_virtualenv() {
    echo "Installing virtualenv..."
    pip3 install virtualenv
}

# Create and activate a virtual environment
create_activate_venv() {
    echo "Creating and activating a virtual environment..."
    VENV_PATH="llms-env"
    virtualenv "$VENV_PATH"

    if [[ "$OS" == "Windows" ]]; then
        source "$VENV_PATH/Scripts/activate"
    else
        source "$VENV_PATH/bin/activate"
    fi
}

# Install Python dependencies
install_python_dependencies() {
    echo "Installing Python dependencies..."
    pip3 install -r requirements.txt
}

# Install frontend dependencies
install_frontend_dependencies() {
    echo "Installing frontend dependencies..."
    cd services/frontend || exit
    npm install
    cd - || exit
}

# Initialize the database
initialize_db() {
    echo "Initializing the database..."
    python3 services/backend/db/init_db.py
}

# Main script execution
detect_os
update_package_lists
install_curl
install_node_nvm
install_python
install_virtualenv
create_activate_venv
install_python_dependencies
install_frontend_dependencies
initialize_db

echo "All installations complete. Your environment is set up and ready to go!"
