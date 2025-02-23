#!/bin/bash

# Path to the shared virtual environment
VENV_PATH="llms-env"

# Function to activate the virtual environment
activate_venv() {
    if [ -d "$VENV_PATH" ]; then
        source "$VENV_PATH/bin/activate"
    else
        echo "Error: Virtual environment not found. Please create it first."
        exit 1
    fi
}

check_and_kill_port() {
    PORT=$1
    PID=""

    if [[ "$OSTYPE" == "linux-gnu"* || "$OSTYPE" == "darwin"* ]]; then
        PID=$(lsof -t -i:$PORT)
        if [ -n "$PID" ]; then
            echo "Port $PORT is already in use by process $PID. Terminating the process..."
            kill -9 $PID
        fi
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
        PID=$(netstat -ano | findstr :$PORT | awk '{print $5}')
        if [ -n "$PID" ]; then
            echo "Port $PORT is already in use by process $PID. Terminating the process..."
            taskkill /PID $PID /F
        fi
    else
        echo "Unsupported OS type: $OSTYPE"
        exit 1
    fi
}

# Function to install an npm package for the frontend
install_frontend_package() {
    PACKAGE_NAME=$1
    if [ -z "$PACKAGE_NAME" ]; then
        echo "Error: No package name provided."
        exit 1
    fi
    echo "Installing npm package '$PACKAGE_NAME'..."
    cd services/frontend || exit
    npm install "$PACKAGE_NAME"
    cd - || exit
    echo "Package '$PACKAGE_NAME' installed successfully."
}

# Function to run the backend service
run_backend() {
    check_and_kill_port 8000
    echo "Starting Backend Service..."
    activate_venv
    cd services/backend/app || exit
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
    cd - || exit
    echo "Backend Service started on http://localhost:8000"
}

# Function to run the frontend service
run_frontend() {
    check_and_kill_port 3000
    echo "Starting Frontend Service..."
    cd services/frontend || exit
    npm start &
    cd - || exit
    echo "Frontend Service started on http://localhost:3000"
}

# Function to run the data analysis service
run_data_analysis() {
    check_and_kill_port 8500
    activate_venv
    echo "Starting Data Analysis Service..."
    cd services/data_analysis/app || exit
    uvicorn main:app --host 0.0.0.0 --port 8500 --reload &
    cd - || exit
    echo "Data Analysis Service started on http://localhost:8500"
}

# Function to reset the database
reset_db() {
    DB_PATH="services/backend/data/database.db"
    echo "Resetting the database..."
    if [ -f "$DB_PATH" ]; then
        rm "$DB_PATH"
        echo "Database deleted."
    fi
    activate_venv
    echo "Initializing the database..."
    python3 services/backend/db/init_db.py
    echo "Database initialized successfully."
}

# Function to show usage information
show_help() {
    echo "Usage: $0 {backend|frontend|data_analysis|all|reset_db|install_frontend_package PACKAGE_NAME}"
    echo "Run the specified service(s) or reset the database."
}

# Check if a command is passed
if [ -z "$1" ]; then
    show_help
    exit 1
fi

# Run the requested service(s)
case "$1" in
    backend)
        run_backend
        ;;
    frontend)
        run_frontend
        ;;
    data_analysis)
        run_data_analysis
        ;;
    all)
        run_backend
        run_frontend
        run_data_analysis
        ;;
    reset_db)
        reset_db
        ;;
    ifp | install_frontend_package | fnpm-install) 
        install_frontend_package "$2"
        ;;
    *)
        show_help
        ;;
esac
