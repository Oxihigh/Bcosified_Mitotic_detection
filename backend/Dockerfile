# Use an official Python 3.12 image
FROM python:3.12-slim-bookworm

# Install system-level dependencies (C++ compilers, OpenCV libs, curl)
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    libgl1-mesa-glx \
    libglib2.0-0 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file and install Python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy your entire backend (models, interpretability, main.py, etc.)
COPY . .

# Expose the port your app runs on
EXPOSE 8000

# The command to run your app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]