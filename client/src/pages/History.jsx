import React, { useEffect, useState } from "react";
import api from "../api/api";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchHistory = async () => {
    try {
      const res = await api.get(`/api/generate/history/${user._id}`);
      setHistory(res.data.data);
    } catch (err) {
      setError("Failed to fetch history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user._id) {
      fetchHistory();
    }
  }, [user._id]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await api.delete(`/api/generate/${id}`);
      setHistory(history.filter(item => item._id !== id));
    } catch (err) {
      alert("Failed to delete generation.");
    }
  };

  const handleDownload = (id) => {
    window.open(`http://localhost:5000/api/generate/${id}/download`, '_blank');
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', paddingTop: '5rem' }}>
        <span className="loader large"></span>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.5px' }}>Generation History</h1>
          <p style={{ color: 'var(--text-secondary)' }}>View and manage your previously generated applications.</p>
        </div>
        <button className="outline" onClick={fetchHistory} style={{ padding: '0.5rem 1rem' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.25rem' }}>
            <polyline points="23 4 23 10 17 10"></polyline>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
          </svg>
          Refresh
        </button>
      </div>

      {error && <div className="error-message mb-4">{error}</div>}

      {history.length === 0 ? (
        <div className="card text-center" style={{ padding: '4rem 2rem' }}>
          <div style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
            </svg>
          </div>
          <h3>No generations found</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0.5rem auto 2rem auto' }}>
            You haven't generated any applications yet. Head over to the home page to start building.
          </p>
          <a href="/" className="button" style={{ display: 'inline-block', backgroundColor: 'var(--accent-color)', color: '#000', padding: '0.75rem 1.5rem', borderRadius: '6px', fontWeight: 600 }}>Create New App</a>
        </div>
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <div className="history-item" key={item._id}>
              <div className="history-header">
                <div>
                  <div className="history-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '500px' }}>
                    {item.prompt}
                  </div>
                  <div className="history-meta">
                    <span><strong>Stack:</strong> {item.stack.toUpperCase()}</span>
                    <span>&bull;</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
                <span className={`badge badge-${item.status}`}>
                  {item.status}
                </span>
              </div>

              {item.status === 'failed' && item.errorMessage && (
                <div style={{ color: 'var(--error-color)', fontSize: '0.85rem', marginBottom: '1rem', padding: '0.5rem', background: 'rgba(255,0,0,0.1)', borderRadius: '4px' }}>
                  <strong>Error:</strong> {item.errorMessage}
                </div>
              )}

              <div className="history-actions">
                <button 
                  disabled={item.status !== "completed"} 
                  onClick={() => handleDownload(item._id)}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Download
                </button>

                <button 
                  className="outline" 
                  onClick={() => handleDelete(item._id)}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', borderColor: 'rgba(255,68,68,0.3)', color: 'var(--error-color)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,68,68,0.1)'; e.currentTarget.style.borderColor = 'var(--error-color)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,68,68,0.3)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;