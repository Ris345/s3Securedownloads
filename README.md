# Secure File Downloads

## Overview
**Secure File Downloads** is a React-based web application designed to provide a secure interface for listing, uploading, and downloading files from an AWS S3 bucket. It leverages AWS Cognito for robust user authentication, ensuring that only authorized users can access the file management features.

## Problem Solved
Managing file access directly via S3 buckets can be complex and insecure if not configured correctly. This project solves the problem of:
- **Unsecured Access**: Preventing public access to sensitive files.
- **User Management**: integrating a managed authentication service (Cognito) instead of building custom auth.
- **User Interface**: Providing a friendly UI for non-technical users to interact with S3, rather than using the AWS Console.

## Features
- **🔐 Secure Authentication**: Integrated with AWS Cognito for secure sign-in and sign-out.
- **📂 File & Folder Browsing**: Navigate through S3 "folders" (prefixes) and view file details.
- **⬇️ Secure Downloads**: Generate presigned URLs on-the-fly for secure, temporary file access.
- **⬆️ File Uploads**: Upload files directly to the current folder.
- **🔍 Search**: Filter files and folders by name.

## Tech Stack
- **Frontend**: React, Vite
- **Authentication**: AWS Cognito (`react-oidc-context`)
- **Backend Integration**: AWS API Gateway & Lambda (implied by API URL)
- **Storage**: AWS S3

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm (Node Package Manager)

### Installation
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in your AWS configuration values:
   - `VITE_API_URL`: Your API Gateway URL
   - `VITE_COGNITO_USER_POOL_ID`: Your Cognito User Pool ID
   - `VITE_COGNITO_CLIENT_ID`: Your Cognito Client ID
   - `VITE_COGNITO_REGION`: Your AWS Region (e.g., us-east-1)
   - `VITE_COGNITO_DOMAIN_PREFIX`: Your Cognito Domain Prefix

*Note: The application uses `import.meta.env` to load these values.*

### Running the Application
To start the development server:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173` (or the URL shown in the terminal).

## Usage
1. **Sign In**: Click the "Sign In" button to authenticate via the hosted Cognito UI.
2. **Browse**: Click "View Folder" to navigate directories.
3. **Download**: Click "Download" next to a file to securely download it.
4. **Upload**: Use the file picker to select and upload a file to the current view.
