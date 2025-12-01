// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "react-oidc-context";

// === COGNITO DETAILS ===
const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
const appClientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
const cognitoRegion = import.meta.env.VITE_COGNITO_REGION;

// ✅ This MUST be your domain prefix from Cognito > App Integration > Domain name
const cognitoDomainPrefix = import.meta.env.VITE_COGNITO_DOMAIN_PREFIX;

// ✅ No trailing slash
const appBaseUrl = "http://localhost:5173";

const cognitoIssuer = `https://cognito-idp.${cognitoRegion}.amazonaws.com/${userPoolId}`;
const cognitoHostedUIUrl = `https://${cognitoDomainPrefix}.auth.${cognitoRegion}.amazoncognito.com`;

// --- Fully Configured OIDC Object ---
const oidcConfig = {
  authority: cognitoIssuer,
  client_id: appClientId,
  redirect_uri: `${appBaseUrl}/`,
  response_type: "code",
  scope: "openid email",
  loadUserInfo: true,

  // ✅ CORRECTED METADATA
  // This block now correctly points to the Cognito Hosted UI URL
  metadata: {
    issuer: cognitoIssuer,
    authorization_endpoint: `${cognitoHostedUIUrl}/oauth2/authorize`,
    token_endpoint: `${cognitoHostedUIUrl}/oauth2/token`,
    userinfo_endpoint: `${cognitoHostedUIUrl}/oauth2/userInfo`,
    end_session_endpoint: `${cognitoHostedUIUrl}/logout?client_id=${appClientId}&logout_uri=${encodeURIComponent(appBaseUrl + "/")}`,
  },

  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider {...oidcConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);