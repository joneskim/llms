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
6. [Services Setup](#services-setup)
   - [Data Analysis Service](#data-analysis-service)

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
node --version
npm --version
```

## Backend Setup

### Create a Virtual Environment

Create a new virtual environment for your project using Python's `venv` module.

```bash
python -m venv llms-backend-env
```

Activate the virtual environment:

- **Windows:** `llms-backend-env\Scripts\activate`
- **macOS and Linux:** `source llms-backend-env/bin/activate`

### Install Backend Dependencies

Install dependencies for your backend project using pip.

```bash
pip install -r requirements.txt
```

### Run the Backend Server

Run your main.py file in the llms-backend folder to start the backend server:

```bash
python main.py
```

## Frontend Setup

### Install Frontend Dependencies

Install dependencies for your frontend project using npm.

```bash
npm install
```

### Run the Frontend Server

Start the frontend server by running the following command in the llms-frontend folder:

```bash
npm start
```

## Additional Configuration

### Setting up a Requirements File

Create a `requirements.txt` file in your llms-backend folder to specify dependencies for your backend project.

### Configuring Environment Variables

Configure environment variables as needed for your project. For example, you can set environment variables in your `main.py` file using Python's built-in `os` 
module.

## Services Setup

### Data Analysis Service

The data-analysis service is responsible for processing and analyzing data for the LLMS. To set up this service:

1. Install dependencies: `pip install -r requirements.txt`
2. Run the service: `python data_analysis_service.py`
