import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate, Link } from "react-router-dom";
import API from "../api";
import "../css/Dashboard.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { FaFolder } from "react-icons/fa";

export default function Dashboard() {
  const [draggedFolderId, setDraggedFolderId] = useState(null);

  const { user, logout } = useAuth();
  const [folders, setFolders] = useState([]);
  const [folderName, setFolderName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await API.get("/drive/folders/parents/");
        setFolders(response.data);
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    };
    fetchFolders();
  }, []);

  const handleCreateFolder = async () => {
    try {
      const response = await API.post("/drive/folders/create/", {
        name: folderName,
        parent: null,
      });
      setFolders([...folders, response.data]);
      setFolderName("");
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  const handleFolderClick = (folderId) => {
    navigate(`/folder/${folderId}`);
  };

  const handleDeleteFolder = async (folderId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this folder?"
    );
    if (!confirmDelete) return;

    try {
      await API.delete(`/drive/folders/${folderId}/`);
      setFolders((prev) => prev.filter((f) => f.id !== folderId));
    } catch (error) {
      console.error("Error deleting folder:", error);
      alert("Delete failed");
    }
  };

  const handleUpdateFolder = async (folderId, newName, newParent) => {
    try {
      const response = await API.patch(`/drive/folders/${folderId}/`, {
        name: newName,
        parent: newParent,
      });
      const updated = response.data;
      setFolders((prev) => prev.map((f) => (f.id === folderId ? updated : f)));
    } catch (error) {
      console.error("Error updating folder:", error);
      alert("Update failed");
    }
  };

  const handleDrop = async (targetFolderId) => {
    if (draggedFolderId === targetFolderId) return; // prevent self-drop
    try {
      await API.patch(`/drive/folders/${draggedFolderId}/`, {
        parent: targetFolderId,
      });
      // Refresh list after move
      const response = await API.get("/drive/folders/parents/");
      setFolders(response.data);
      setDraggedFolderId(null);
    } catch (error) {
      console.error("Error moving folder:", error);
    }
  };

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="dashboard-container">
      <Navbar user={user} logout={logout} />

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2 className="dashboard-title">My Drive</h2>
          <div className="dashboard-actions">
            {/* You might add more actions here, like "Upload" */}
          </div>
        </div>

        <div className="new-folder-section">
          <h3>Create New Folder</h3>
          <input
            type="text"
            className="new-folder-input"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Enter folder name"
          />
          <button className="create-folder-button" onClick={handleCreateFolder}>
            Create
          </button>
        </div>

        <div className="folders-section">
          <h3>Your Folders</h3>
          {folders.length > 0 ? (
            <table className="folders-table">
              <thead>
                <tr>
                  <th>Name</th>
                </tr>
              </thead>

              <tbody>
                {folders.map((folder) => (
                  <tr
                    key={folder.id}
                    draggable
                    onDragStart={() => setDraggedFolderId(folder.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(folder.id)}
                  >
                    <td>
                      <Link to={`/folder/${folder.id}`} className="folder-link">
                        <FaFolder
                          style={{ marginRight: "8px", color: "#ffc107" }}
                        />
                        {folder.name}
                      </Link>
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          const newName = prompt("Enter new name", folder.name);
                          // const moveTo = prompt(
                          //   "Enter parent folder ID to move (or leave blank)",
                          //   folder.parent || ""
                          // );
                          handleUpdateFolder(
                            folder.id,
                            newName
                            // moveTo || null
                          );
                        }}
                      >
                        Edit
                      </button>
                      <button
                        style={{ marginLeft: "10px", color: "red" }}
                        onClick={() => handleDeleteFolder(folder.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No folders created yet.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
