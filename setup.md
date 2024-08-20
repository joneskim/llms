# Local Learning Management System (LLMS) Setup Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
   - [Python Installation](#python-installation)
   - [Node.js and npm Installation](#nodejs-and-npm-installation)
3. [Backend Setup](#backend-setup)
   - [Create a Virtual Environment](#create-a-virtual-environment)
   - [Install Backend Dependencies](#install-backend-dependencies)
   - [Run the Backend Server](#run-the-backend-server)
4. [Frontend Setup](#frontend-setup)
   - [Install Frontend Dependencies](#install-frontend-dependencies)
   - [Run the Frontend Server](#run-the-frontend-server)
5. [Additional Configuration](#additional-configuration)
   - [Setting up a Requirements File](#setting-up-a-requirements-file)
   - [Configuring Environment Variables](#configuring-environment-variables)
6. [Troubleshooting](#troubleshooting)
7. [Conclusion](#conclusion)

## Introduction

This documentation provides a step-by-step guide to setting up the development environment for the Local Learning Management System (LLMS). This includes 
setting up both the backend (Python) and the frontend (React.js) of the project.

## Prerequisites

Before starting, ensure your system meets the following requirements:

- **Operating System:** Windows, macOS, or Linux
- **Python:** Version 3.8 or later
- **Node.js:** Version 14.x or later (includes npm)

### Python Installation

Ensure that Python 3.8 or later is installed on your machine.

- **Windows:**
  1. Download the Python installer from the [official website](https://www.python.org/downloads/).
  2. Run the installer, and make sure to check the option to "Add Python to PATH" during installation.

- **macOS and Linux:**
  - Python 3.x should be pre-installed. You can check by running:
    ```bash
    python3 --version
    ```
  - If not installed, you can install it via Homebrew (macOS) or your package manager (Linux):
    ```bash
    brew install python  # macOS
    sudo apt-get install python3  # Ubuntu/Linux
    ```

### Node.js and npm Installation

npm is required to manage packages for the frontend.

- **Windows:**
  1. Download and install Node.js from the [official website](https://nodejs.org/). npm is included with Node.js.

- **macOS and Linux:**
  - You can install Node.js via Homebrew (macOS) or your package manager (Linux):
    ```bash
    brew install node  # macOS
    sudo apt-get install nodejs npm  # Ubuntu/Linux
    ```

After installation, verify the installation by running:
```bash
node -v
npm -v
```
## Backend Setup

### Create a Virtual Environment

To isolate the project's dependencies from system-wide packages, create a virtual environment using `venv`:
```bash
python3 -m venv llms-env
```
Activate the environment:
```bash
source llms-env/bin/activate  # macOS/Linux
llms-env\Scripts\activate  # Windows
```
### Install Backend Dependencies

Install the required packages for the backend using `pip`:
```
pip install -r requirements.txt
```
### Run the Backend Server

Run the backend server using the following command:
```
python app.py
```

## Frontend Setup

### Install Frontend Dependencies

Install the required packages for the frontend using `npm`:
```
npm install
```
### Run the Frontend Server

Run the frontend server using the following command:
```
npm start
```

## Additional Configuration

### Setting up a Requirements File

Create a `requirements.txt` file to manage dependencies for the backend. You can use pip's built-in feature to generate this file:
```
pip freeze > requirements.txt
```
### Configuring Environment Variables

Set environment variables for your project by creating a `.env` file in the root directory. For example, you can set `PORT=5000` for the backend server.

## Troubleshooting

If you encounter any issues during setup or runtime, refer to the troubleshooting section for common errors and solutions.
