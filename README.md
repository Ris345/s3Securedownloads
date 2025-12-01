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
The application is currently configured to point to a specific AWS environment.
- **API URL**: `https://o4syaqmqz1.execute-api.us-east-1.amazonaws.com/Dev`
- **Cognito User Pool**: `us-east-1_NEdC8Bsi0`
- **Client ID**: `22q9r34l92vf998kbveaqpjeej`

*Note: These configurations are located in `src/App.jsx` and `src/main.jsx`.*

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
