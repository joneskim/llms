**Local Learning Management System (LLMS) - Setup and Start Guide**
===============================

### Table of Contents
* [Introduction](#introduction)
* [Prerequisites](#prerequisites)
	+ [Python Installation](#python-installation)
	+ [Node.js Installation](#node-js-installation)
	+ [Git Installation](#git-installation)
* [Environment Setup](#environment-setup)
	+ [Setup GitHub to use SSH instead of 
HTTP](#setup-github-to-use-ssh-instead-of-http)
* [Project Setup](#project-setup)
	+ [Clone the Repository](#clone-the-repository)
* [Virtual Environment Setup](#virtual-environment-setup)
	+ [Create a shared virtual 
environment](#create-a-shared-virtual-environment)
	+ [Activate the virtual environment](#activate-the-virtual-environment)
* [Install Dependencies](#install-dependencies)
	+ [Python dependencies for the backend and data analysis 
services](#python-dependencies-for-the-backend-and-data-analysis-services)
	+ [Node.js dependencies for the frontend 
service](#node-js-dependencies-for-the-frontend-service)
* [Using the run.sh Script](#using-the-run-sh-script)
	+ [Starting Individual Services](#starting-individual-services)
	+ [Starting All Services](#starting-all-services)
	+ [Stopping Services](#stopping-services)
* [Troubleshooting](#troubleshooting)
* [Conclusion](#conclusion)

### Introduction
The Local Learning Management System (LLMS) is a comprehensive solution 
for managing and analyzing learning data. It consists of multiple 
services, including a backend (FastAPI), frontend (React), and a data 
analysis service. These services are managed and run using a single Bash 
script.

### Prerequisites

Before setting up the project, ensure your system meets the following 
prerequisites:

#### Python Installation
To use the LLMS, you will need to have Python 3.8 or later installed on 
your machine. You can download and install Python from the official 
website.

* Verify Installation:
```
bash
Copy code
python --version
```

#### Node.js Installation
You will also need to have Node.js 14.x or later installed on your 
machine. You can download and install Node.js from the official website.

* Verify Installation:
```
bash
Copy code
node --version
npm --version
```

#### Git Installation
Finally, you will need to have Git installed on your machine. You can 
download and install Git from the official website.

* Verify Installation:
```
bash
Copy code
git --version
```

### Environment Setup

Before setting up the project, make sure that your environment is properly 
set up:

#### Setup GitHub to use SSH instead of HTTP
To connect to GitHub using SSH, you will need to generate a public-private 
key pair and add the public key to your GitHub account.

* Follow these steps:
	1. Open a terminal or command prompt.
	2. Run the following command to generate a new key pair: `ssh-keygen -t 
rsa -b 4096`
	3. When prompted for a file name, enter a path where you want to save the 
key (e.g., `/Users/username/.ssh/id_rsa`).
	4. Add the public key to your GitHub account by going to your profile 
settings, then clicking on "SSH and GPG keys" and adding the new key.

### Project Setup

To set up the project, follow these steps:

#### Clone the Repository
Clone the LLMS repository from GitHub using SSH:
```
git clone git@github.com:your-username/LLMS.git
```

Replace `your-username` with your actual username on GitHub.

### Virtual Environment Setup

The LLMS uses a virtual environment to manage its dependencies. Follow 
these steps to set up and activate the virtual environment:

#### Create a shared virtual environment
Create a new directory for the virtual environment:
```
mkdir llms-env
```

Activate the virtual environment:
```
source llms-env/bin/activate
```

### Install Dependencies

Install the dependencies required by the LLMS using pip and npm:

#### Python dependencies for the backend and data analysis services
Run the following command to install the Python dependencies:
```
pip install -r requirements.txt
```

#### Node.js dependencies for the frontend service
Run the following command to install the Node.js dependencies:
```
npm install
```

### Using the run.sh Script

The LLMS uses a single Bash script, `run.sh`, to start and manage its 
services. Follow these steps to use the script:

#### Starting Individual Services
To start an individual service, simply run the corresponding command from 
the `run.sh` file:
```
./run.sh backend
```

```
./run.sh frontend
```

```
./run.sh data-analysis
```

#### Starting All Services
To start all services at once, run the following command:
```
./run.sh all
```

#### Stopping Services
To stop a service just cancel the terminal its on or Control + C.

### Troubleshooting

If you encounter any issues while setting up or using the LLMS, refer to 
the troubleshooting guide for help.

### Conclusion
Congratulations! You have now successfully set up and started the Local 
Learning Management System (LLMS). The LLMS is a powerful tool for 
managing and analyzing learning data, and with this documentation, you 
should be able to get started quickly. Happy coding!