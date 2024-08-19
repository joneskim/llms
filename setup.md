# Setting up the python backend
1. Create a virtual environment by running the following commands on the terminal
python -m venv llms-env
source llms-env/bin/activate  # On Windows use `llms-env\Scripts\activate`


2, Install necessary packages. This should do the trick for now. I will setup a requirements file:
pip install fastapi uvicorn pandas numpy scikit-learn sqlite3

