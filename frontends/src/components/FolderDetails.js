import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";
import { FaFolder, FaFileAlt, FaPlus, FaUpload } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import Footer from './Footer';


const FolderDetails = () => {
  // const accessToken = localStorage.getItem("access");
  const { folderId } = useParams();
  // const navigate = useNavigate();
  const [folder, setFolder] = useState(null);
  const [parentFolder, setParentFolder] = useState(null);
  const [childData, setChildData] = useState({ folders: [], files: [] });


  const fetchFolderDetails = async () => {
    try {
      const response = await API.get(`/drive/folders/${folderId}/`);
      setFolder(response.data); // Update the folder state with the fetched data
    } catch (error) {
      console.error("Error fetching folder details:", error);
    }
  };

  useEffect(() => {
    // Fetch folder details when folderId changes
    if (folderId) {
      fetchFolderDetails();
    }
  }, [folderId]);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await API.get(
          `/drive/folders/list/?parent=${folderId}`
        );
        setChildData(response.data);
      } catch (error) {
        console.error("Error fetching child folders/files:", error);
      }
    };
    fetchChildren();
  }, [folderId]);

  useEffect(() => {
    if (folder && folder.parent) {
      const fetchParentFolder = async () => {
        try {
          const response = await API.get(`/drive/folders/${folder.parent}/`);
          setParentFolder(response.data);
        } catch (error) {
          console.error("Error fetching parent folder:", error);
        }
      };
      fetchParentFolder();
    } else {
      setParentFolder(null);
    }
  }, [folder]);

  const handleCreateFolder = async () => {
    const name = prompt("Enter new folder name:");
    if (name) {
      try {
        await API.post("/drive/folders/create/", {
          name,
          parent: folderId,
        });
        window.location.reload();
      } catch (error) {
        alert("Error creating folder");
      }
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folderId); // Ensure folderId is defined
    formData.append("name", file.name); // If the API expects it

    const accessToken = localStorage.getItem("access");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/drive/files/upload/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      const result = await response.json();
      console.log("Uploaded:", result);

      // After successful upload, fetch the latest folder data to update the UI
      fetchFolderDetails();
      fetchChildren(); // This function should be used to refresh the folder data
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const fetchChildren = async () => {
    try {
      const response = await API.get(`/drive/folders/list/?parent=${folderId}`);
      setChildData(response.data); // Update the child data (folders/files)
    } catch (error) {
      console.error("Error fetching child folders/files:", error);
    }
  };

  const [selectedFile, setSelectedFile] = useState(null);

  const handlePreview = (file) => {
    setSelectedFile(file);
  };

  const handleRename = async (type, id, currentName) => {
    const newName = prompt(`Enter new ${type} name:`, currentName);
    if (newName && newName !== currentName) {
      try {
        await API.patch(`/drive/${type}s/${id}/`, { name: newName });
        window.location.reload();
      } catch (error) {
        alert(`Error renaming ${type}`);
      }
    }
  };

  const handleDelete = async (type, id) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        await API.delete(`/drive/${type}s/${id}/`);
        window.location.reload();
      } catch (error) {
        alert(`Error deleting ${type}`);
      }
    }
  };

  const [dragItem, setDragItem] = useState(null);

  const handleDragStart = (type, id) => {
    setDragItem({ type, id });
  };

  const handleDrop = async (targetFolderId) => {
    if (!dragItem) return;
    try {
      await API.patch(`/drive/${dragItem.type}s/${dragItem.id}/`, {
        parent: targetFolderId || null,
      });
      window.location.reload();
    } catch (error) {
      alert("Move failed.");
    } finally {
      setDragItem(null);
    }
  };

  return (
    <div style={styles.container}>
      {/* Breadcrumbs */}
      <div style={styles.breadcrumbs}>
        <Link to="/dashboard" style={styles.breadcrumbLink}>
          My Drive
        </Link>
        {parentFolder && (
          <>
            <IoIosArrowForward style={styles.breadcrumbSeparator} />
            <Link
              to={`/folder/${parentFolder.id}`}
              style={styles.breadcrumbLink}
            >
              {parentFolder.name}
            </Link>
          </>
        )}
        {folder && (
          <>
            <IoIosArrowForward style={styles.breadcrumbSeparator} />
            <span style={styles.currentBreadcrumb}>{folder.name}</span>
          </>
        )}
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        <button style={styles.button} onClick={handleCreateFolder}>
          <FaPlus style={{ marginRight: "6px" }} />
          New Folder
        </button>
        <label htmlFor="file-upload" style={styles.button}>
          <FaUpload style={{ marginRight: "6px" }} />
          Add File
          <input
            id="file-upload"
            type="file"
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
        </label>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Folders</h2>
        {childData.folders.length > 0 ? (
          <ul style={styles.list}>
            {childData.folders.map((subfolder) => (
              <li
                key={subfolder.id}
                style={styles.listItem}
                draggable
                onDragStart={() => handleDragStart("folder", subfolder.id)}
                onDrop={() => handleDrop(subfolder.id)}
                onDragOver={(e) => e.preventDefault()}
              >
                <Link
                  to={`/folder/${subfolder.id}`}
                  style={styles.listItemLink}
                >
                  <FaFolder style={styles.iconListItem} />
                  <span>{subfolder.name}</span>
                </Link>
                <div>
                  <button
                    onClick={() =>
                      handleRename("folder", subfolder.id, subfolder.name)
                    }
                  >
                    Rename
                  </button>
                  <button onClick={() => handleDelete("folder", subfolder.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p style={styles.empty}>No subfolders</p>
        )}
      </div>

      {/* files */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Files</h2>
        {childData.files.length > 0 ? (
          <ul style={styles.list}>
            {childData.files.map((file) => (
              <li
                key={file.id}
                style={styles.listItem}
                draggable
                onDragStart={() => handleDragStart("file", file.id)}
                onDrop={() => handleDrop(folderId)}
                onDragOver={(e) => e.preventDefault()}
              >
                <FaFileAlt style={styles.iconListItem} />
                <span
                  onClick={() => handlePreview(file)}
                  style={{ ...styles.listItemLink, cursor: "pointer" }}
                >
                  <span>{file.name}</span>
                </span>

                <span style={styles.fileDetails}>
                  {/* (Uploaded: {new Date(file.uploaded_at).toLocaleString()}) */}
                </span>
                <div>
                  <button
                    onClick={() => handleRename("file", file.id, file.name)}
                  >
                    Rename
                  </button>
                  <button onClick={() => handleDelete("file", file.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p style={styles.empty}>No files</p>
        )}
      </div>

      {selectedFile && (
  <div style={{ marginTop: "30px", backgroundColor: "#fff", padding: "20px", borderRadius: "8px" }}>
    <h3>Preview: {selectedFile.name}</h3>
    {selectedFile.file.endsWith(".pdf") ? (
      <iframe
        src={selectedFile.file}
        width="100%"
        height="600px"
        style={{ border: "none" }}
        title="File Preview"
      ></iframe>
    ) : selectedFile.file.match(/\.(png|jpg|jpeg|gif)$/) ? (
      <img
        src={selectedFile.file}
        alt={selectedFile.name}
        style={{ maxWidth: "100%", maxHeight: "600px" }}
      />
    ) : (
      <p>No preview available for this file type.</p>
    )}
  </div>
)}




      {/* Drop here to move outside */}
      <div
        style={{
          border: "1px dashed #aaa",
          padding: "10px",
          marginTop: "30px",
          textAlign: "center",
        }}
        onDrop={() => handleDrop(null)}
        onDragOver={(e) => e.preventDefault()}
      >
        Drop here to move to root
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  container: {
    padding: "30px 40px",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
  },
  breadcrumbs: {
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
  },
  breadcrumbLink: {
    color: "#1a73e8",
    textDecoration: "none",
    fontWeight: 500,
  },
  breadcrumbSeparator: {
    margin: "0 8px",
    color: "#777",
  },
  currentBreadcrumb: {
    color: "#000",
    fontWeight: 600,
  },
  actions: {
    marginBottom: "30px",
    display: "flex",
    gap: "10px",
  },
  button: {
    backgroundColor: "#fff",
    color: "#202124",
    border: "1px solid #ccc",
    borderRadius: "6px",
    padding: "10px 16px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: "#f0f0f0",
    },
    "& input[type='file']": {
      display: "none",
    },
  },
  section: {
    marginTop: "30px",
  },
  sectionTitle: {
    fontSize: "18px",
    marginBottom: "12px",
    fontWeight: 600,
    color: "#202124",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  listItem: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    marginBottom: "10px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "center",
    padding: "10px 15px",
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: "#f9f9f9",
    },
  },
  listItemLink: {
    textDecoration: "none",
    color: "#202124",
    display: "flex",
    alignItems: "center",
    flexGrow: 1,
  },
  iconListItem: {
    fontSize: "1.5em",
    marginRight: "15px",
    color: "#fbbc04", // Default folder color
  },
  fileDetails: {
    fontSize: "0.8em",
    color: "#777",
    marginLeft: "15px",
  },
  empty: {
    fontStyle: "italic",
    color: "#999",
    fontSize: "14px",
  },
};

export default FolderDetails;
