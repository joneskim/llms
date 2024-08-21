**Local Learning Management System (LLMS) - Setup and Start Guide**
===============================

### Table of Contents
* Introduction
* Prerequisites
* Python Installation
* Node.js Installation
* Git Installation
* Environment Setup
* Project Setup
* Clone the Repository
* Virtual Environment Setup
* Install Dependencies
* Using the run.sh Script
* Starting Individual Services
* Starting All Services
* Stopping Services
* Troubleshooting
* Conclusion

### Introduction
This guide provides comprehensive instructions for setting up the Local 
Learning Management System (LLMS) on your local machine and starting the 
services. The LLMS consists of multiple services, including a backend 
(FastAPI), frontend (React), and a data analysis service. These services 
are managed and run using a single Bash script.

### Prerequisites
Before setting up the project, ensure your system meets the following 
prerequisites:

* **Python Installation**
	+ Version: Python 3.8 or later
	+ Installation: Download and install Python from the official website.
	+ Verify Installation:
```
bash
Copy code
python --version
```
* **Node.js Installation**
	+ Version: Node.js 14.x or later
	+ Installation: Download and install Node.js from the official website.
	+ Verify Installation:
```
bash
Copy code
node --version
npm --version
```
* **Git Installation**
	+ Installation: Download and install Git from the official website.
	+ Verify Installation:
```
bash
Copy code
git --version
```

### Environment Setup
* Terminal: Use a terminal or command prompt. On Windows, you can use Git 
Bash, WSL, or the native Command Prompt.

**Setup GitHub to use SSH instead of HTTP**

We recommend setting up GitHub to use SSH instead of HTTP for increased 
security and ease of use. To do this:

1. Generate an SSH key pair:
```
bash
Copy code
ssh-keygen -t rsa -b 4096
```
2. Add the public key to your GitHub account:
	+ Go to your GitHub settings > SSH and GPG keys
	+ Click "New SSH key" and paste the contents of the public key file 
(usually `id_rsa.pub`)
3. Configure Git to use SSH:
```
bash
Copy code
git config --global url."https://github.com/".insteadOf 
"ssh://github.com/"
```

### Project Setup
* **Clone the Repository**
Open your terminal and clone the LLMS repository:
```
bash
Copy code
git clone git@github.com:your-repo/llms.git
cd llms
```

### Virtual Environment Setup
* Create a shared virtual environment:
```
bash
Copy code
python -m venv llms-env
```
* Activate the virtual environment:
	+ Windows: `llms-env\Scripts\activate`
	+ macOS/Linux: `source llms-env/bin/activate`

### Install Dependencies
* Install Python dependencies for the backend and data analysis services:
```
bash
Copy code
pip install -r services/backend/requirements.txt
pip install -r services/data_analysis/requirements.txt
```
* Install Node.js dependencies for the frontend service:
```
bash
Copy code
cd services/frontend
npm install
cd ../..
```

### Using the run.sh Script
The `run.sh` script is designed to manage the services for the LLMS 
project. You can start individual services or all services at once.

### Starting Individual Services
* To start a specific service (backend, frontend, or data analysis):
	+ Backend Service: `./run.sh backend`
	+ Frontend Service: `./run.sh frontend`
	+ Data Analysis Service: `./run.sh data_analysis`
Each service will be accessible at the following URLs:
	+ Backend: http://localhost:8000
	+ Frontend: http://localhost:3000
	+ Data Analysis: http://localhost:8500

### Starting All Services
* To start all services at once:
```
bash
Copy code
./run.sh all
```
This command will start the backend, frontend, and data analysis services 
simultaneously.

### Stopping Services
To stop the services, you can manually kill the processes using their 
process IDs (PIDs) or simply close the terminal window running the 
services. If you start services in the background using &, you can bring 
them to the foreground using `fg` and then use `Ctrl+C` to terminate.

**You are now ready to develop and use your LLMS!**

I hope this revised guide is helpful in setting up your Local Learning 
Management System (LLMS). Happy coding!