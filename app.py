import os
import shutil
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def run_command(command, cwd=None):
    print(f"Running: {' '.join(command)}")
    return subprocess.run(command, cwd=str(cwd or ROOT), check=False).returncode


def ensure_tools():
    node_path = shutil.which("node")
    npm_path = shutil.which("npm")
    if not node_path or not npm_path:
        print("Node.js and npm are required but were not found in PATH.")
        return False
    print(f"Node.js: {node_path}")
    print(f"npm: {npm_path}")
    return True


def install_frontend():
    print("\nInstalling frontend dependencies...")
    return run_command(["npm", "install"], cwd=ROOT)


def install_backend():
    backend_dir = ROOT / "backend"
    print("\nInstalling backend dependencies...")
    return run_command(["npm", "install"], cwd=backend_dir)


def start_frontend():
    print("\nStarting frontend...")
    kwargs = {"cwd": str(ROOT)}
    if os.name == "nt":
        kwargs["creationflags"] = getattr(subprocess, "CREATE_NEW_CONSOLE", 0)
    subprocess.Popen(["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "4173"], **kwargs)


def start_backend():
    print("\nStarting backend...")
    kwargs = {"cwd": str(ROOT)}
    if os.name == "nt":
        kwargs["creationflags"] = getattr(subprocess, "CREATE_NEW_CONSOLE", 0)
    subprocess.Popen(["node", "backend/server.js"], **kwargs)


def main():
    print("PhishGuard startup helper")
    print(f"Project root: {ROOT}")

    if not ensure_tools():
        sys.exit(1)

    frontend_status = install_frontend()
    if frontend_status != 0:
        print("Frontend installation failed.")
        sys.exit(frontend_status)

    backend_status = install_backend()
    if backend_status != 0:
        print("Backend installation failed.")
        sys.exit(backend_status)

    start_backend()
    time.sleep(2)
    start_frontend()

    print("\nProject started successfully.")
    print("Frontend URL: http://localhost:4173")
    print("Backend health: http://localhost:5001/api/health")
    print("\nPress Ctrl+C in this terminal to stop the launcher.")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down launcher...")


if __name__ == "__main__":
    main()
