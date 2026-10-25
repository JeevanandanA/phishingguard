# Full Installation Guide for Windows

This guide explains how to run the frontend and backend of this project on Windows.

## 1. Prerequisites
Install the following:
- Node.js 18 or newer
- npm
- Python 3.10 or newer
- pip
- Visual Studio Code (recommended)

Check versions:
```powershell
node -v
npm -v
python --version
pip --version
```

## 2. Open the Project Folder
Open the project folder in VS Code:
```powershell
cd C:\path\to\your\project-folder
```

## 3. Frontend Setup
### Install frontend dependencies
```powershell
npm install
```

### Run the frontend
```powershell
npm run dev
```

Open the local URL shown in the terminal, usually:
```text
http://localhost:5173/
```

## 4. Backend Setup
If the project has a backend folder, open it in a separate terminal.

Example:
```powershell
cd C:\path\to\your\project-folder\backend
```

### Create a virtual environment
```powershell
python -m venv venv
```

### Activate the environment
```powershell
venv\Scripts\activate
```

### Install backend dependencies
```powershell
pip install -r requirements.txt
```

### Run the backend server
```powershell
python app.py
```

or, if the project uses Flask/FastAPI:
```powershell
python -m flask run
```

or:
```powershell
uvicorn main:app --reload
```

The backend will usually run at:
```text
http://127.0.0.1:8000/
```

## 5. Common Issues
- If `npm install` fails, try:
```powershell
npm install --legacy-peer-deps
```
- If Python packages fail, try:
```powershell
pip install --upgrade pip
```
- If the backend does not start, check whether the required port is already in use.

## 6. Build for Production
Frontend:
```powershell
npm run build
```

Backend:
```powershell
python app.py
```
