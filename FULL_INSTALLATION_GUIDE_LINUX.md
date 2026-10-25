# Full Installation Guide for Linux

This guide explains how to run the frontend and backend of this project on Linux.

## 1. Prerequisites
Install the following:
- Node.js 18 or newer
- npm
- Python 3.10 or newer
- pip
- Visual Studio Code (recommended)

Check versions:
```bash
node -v
npm -v
python3 --version
pip3 --version
```

## 2. Open the Project Folder
Open the project folder in your terminal:
```bash
cd /path/to/your/project-folder
```

## 3. Frontend Setup
### Install frontend dependencies
```bash
npm install
```

### Run the frontend
```bash
npm run dev
```

Open the local URL shown in the terminal, usually:
```text
http://localhost:5173/
```

## 4. Backend Setup
If the project has a backend folder, open it in a separate terminal.

Example:
```bash
cd /path/to/your/project-folder/backend
```

### Create a virtual environment
```bash
python3 -m venv venv
```

### Activate the environment
```bash
source venv/bin/activate
```

### Install backend dependencies
```bash
pip install -r requirements.txt
```

### Run the backend server
```bash
python app.py
```

or, if the project uses Flask/FastAPI:
```bash
python -m flask run
```

or:
```bash
uvicorn main:app --reload
```

The backend will usually run at:
```text
http://127.0.0.1:8000/
```

## 5. Common Issues
- If `npm install` fails, try:
```bash
npm install --legacy-peer-deps
```
- If Python packages fail, try:
```bash
pip install --upgrade pip
```
- If the backend does not start, check whether the required port is already in use.

## 6. Build for Production
Frontend:
```bash
npm run build
```

Backend:
```bash
python app.py
```
