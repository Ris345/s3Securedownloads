import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "react-oidc-context";
import "./App.css";

const apiInvokeUrl = import.meta.env.VITE_API_URL;

export default function App() {
  const auth = useAuth();
  const [items, setItems] = useState({
    files: [],
    folders: [],
    currentPrefix: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloadMessage, setDownloadMessage] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchItems = useCallback(
    async (prefix = "") => {
      if (!auth.isAuthenticated || !auth.user?.id_token) return;

      setIsLoading(true);
      setError(null);
      setDownloadMessage("");
      setUploadMessage("");

      try {
        const url = new URL(`${apiInvokeUrl}/files`);
        if (prefix) url.searchParams.append("prefix", prefix);

        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${auth.user.id_token}` },
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({
            error: `Failed to fetch list (Status: ${response.status})`,
          }));
          throw new Error(errData.error);
        }

        const data = await response.json();
        setItems({
          files: data.files || [],
          folders: data.folders || [],
          currentPrefix: prefix,
        });
      } catch (err) {
        setError(err.message);
        setItems({ files: [], folders: [], currentPrefix: "" });
      } finally {
        setIsLoading(false);
      }
    },
    [auth.isAuthenticated, auth.user?.id_token]
  );

  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchItems();
    }
  }, [auth.isAuthenticated, fetchItems]);

  const handleDownload = async (filename) => {
    if (!auth.isAuthenticated || !auth.user?.id_token) {
      setDownloadMessage("Authentication required to download files.");
      return;
    }

    setDownloadMessage(`Preparing download for ${filename}...`);
    try {
      const response = await fetch(
        `${apiInvokeUrl}/download?filename=${encodeURIComponent(filename)}`,
        {
          headers: { Authorization: `Bearer ${auth.user.id_token}` },
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({
          error: `Failed to get download URL (Status: ${response.status})`,
        }));
        throw new Error(errData.error);
      }

      const data = await response.json();
      if (!data.download_url) throw new Error("No download_url in response.");

      const link = document.createElement("a");
      link.href = data.download_url;
      link.setAttribute("download", filename.split("/").pop());
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadMessage(`✅ Downloaded ${filename.split("/").pop()}`);
    } catch (err) {
      setDownloadMessage(`Error downloading: ${err.message}`);
    }
  };

  const uploadFile = async (file) => {
    if (!auth.isAuthenticated || !auth.user?.id_token) {
      setUploadMessage("Authentication required to upload files.");
      return;
    }

    setUploadMessage(`Uploading ${file.name}...`);

    try {
      const reader = new FileReader();

      reader.onload = async () => {
        const base64Content = reader.result.split(",")[1];

        const response = await fetch(`${apiInvokeUrl}/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${auth.user.id_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filename: `${items.currentPrefix}${file.name}`,
            file_content: base64Content,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({
            error: `Failed to upload (Status: ${response.status})`,
          }));
          throw new Error(errData.error);
        }

        const result = await response.json();
        setUploadMessage(`✅ ${result.message}`);
        fetchItems(items.currentPrefix);
      };

      reader.onerror = () => {
        throw new Error("Failed to read file");
      };

      reader.readAsDataURL(file);
    } catch (err) {
      setUploadMessage(`Error uploading: ${err.message}`);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  useEffect(() => {
    if (uploadMessage) {
      const timeout = setTimeout(() => setUploadMessage(""), 5000);
      return () => clearTimeout(timeout);
    }
  }, [uploadMessage]);

  const filteredFiles = items.files.filter((file) =>
    file.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredFolders = items.folders.filter((folder) =>
    folder.prefix.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (auth.isLoading) {
    return <div className="card">Loading authentication info...</div>;
  }

  if (auth.error) {
    return (
      <div className="card error">
        ⚠️ Authentication Error: {auth.error.message}
        <p>Check browser console for details.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>🔐 Secure File Downloads</h2>
      {auth.isAuthenticated ? (
        <>
          <p>
            Welcome, <strong>{auth.user?.profile?.email || "User"}</strong>
          </p>

          <input
            type="text"
            className="search-input"
            placeholder="Search files or folders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <input type="file" onChange={handleFileChange} className="file-input" />

          {uploadMessage && (
            <div
              className={`upload-banner ${uploadMessage.startsWith("Error") ? "error" : "success"
                }`}
            >
              {uploadMessage}
            </div>
          )}

          {isLoading && <p>Loading items...</p>}
          {error && <p className="error">❌ {error}</p>}

          {!isLoading && !error && (
            <>
              {items.currentPrefix && (
                <button className="btn black" onClick={() => fetchItems("")}>
                  ← Back to Root
                </button>
              )}

              {filteredFolders.length > 0 && (
                <>
                  <h3>📁 Folders</h3>
                  <ul className="file-list">
                    {filteredFolders.map((folder) => (
                      <li key={folder.prefix} className="file-item">
                        <span>
                          {folder.prefix.replace(items.currentPrefix, "")}
                        </span>
                        <button
                          className="btn black"
                          onClick={() => fetchItems(folder.prefix)}
                        >
                          View Folder
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {filteredFiles.length > 0 && (
                <>
                  <h3>📄 Files</h3>
                  <ul className="file-list">
                    {filteredFiles.map((file) => (
                      <li key={file.filename} className="file-item">
                        <span>
                          {file.filename.replace(items.currentPrefix, "")}
                          <small>
                            ({Math.ceil(file.size / 1024)} KB) •{" "}
                            {new Date(file.lastModified).toLocaleDateString()}
                          </small>
                        </span>
                        <button
                          className="btn black"
                          onClick={() => handleDownload(file.filename)}
                        >
                          Download
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {filteredFolders.length === 0 &&
                filteredFiles.length === 0 &&
                !isLoading && <p>No files or folders found.</p>}
            </>
          )}

          {downloadMessage && (
            <p className={downloadMessage.startsWith("Error") ? "error" : "success"}>
              {downloadMessage}
            </p>
          )}

          <button className="btn black" onClick={() => auth.signoutRedirect()}>
            Sign Out
          </button>
        </>
      ) : (
        <div>
          <p>Please sign in to view and download files.</p>
          <button className="btn black" onClick={() => auth.signinRedirect()}>
            Sign In
          </button>
        </div>
      )}
    </div>
  );
}
