from setuptools import setup

setup(
    name="phishguard-customer",
    version="1.0.0",
    description="Customer launcher for the PhishGuard security project",
    long_description=(
        "This package installs a simple launcher that starts the project frontend and backend "
        "for customer use."
    ),
    long_description_content_type="text/plain",
    py_modules=["app"],
    include_package_data=True,
    python_requires=">=3.10",
    entry_points={
        "console_scripts": [
            "phishguard-app=app:main",
        ]
    },
)
