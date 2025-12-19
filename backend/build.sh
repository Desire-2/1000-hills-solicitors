#!/bin/bash
# Render build script

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Setting up database..."
python setup_db.py

echo "Build completed successfully!"
