import React, { useState, useEffect } from 'react';
import api from '../api/api';

function Home() {
  const [prompt, setPrompt] = useState("");
  const [stack, setStack] = useState("");
  const [loading, setLoading] = useState(false);
  const [generationId, setGenerationId] = useState(null);
  const [status, setStatus] = useState(null); // 'pending', 'processing', 'completed', 'failed'
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    let interval;
    if (generationId && (status === 'pending' || status === 'processing')) {
      interval = setInterval(async () => {
        try {
          const res = await api.get(`/api/generate/${generationId}`);
          const newStatus = res.data.data.status;
          setStatus(newStatus);
          
          if (newStatus === 'completed' || newStatus === 'failed') {
            clearInterval(interval);
            setLoading(false);
            if (newStatus === 'failed') {
               setError(res.data.data.errorMessage || "Generation failed.");
            }
          }
        } catch (err) {
          console.error(err);
          setError("Failed to check status.");
          clearInterval(interval);
          setLoading(false);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [generationId, status]);

  const handleGenerate = async () => {
    if (!prompt.trim() || !stack) {
      setError("Please provide both a prompt and select a stack.");
      return;
    }
    setError("");
    setLoading(true);
    setStatus('pending');
    setGenerationId(null);

    try {
      const res = await api.post('/api/generate', {
        userId: user._id,
        prompt,
        stack
      });
      setGenerationId(res.data.data.id);
      setStatus(res.data.data.status);
    } catch (err) {
      setError(err.response?.data?.message || "Generation failed.");
      setLoading(false);
      setStatus(null);
    }
  };

  const handleDownload = () => {
    if (generationId && status === 'completed') {
      window.open(`http://localhost:5000/api/generate/${generationId}/download`, '_blank');
    }
  };

  return (
    <div className="container">
      <div className="card text-center pb-4 mb-4" style={{ padding: '4rem 2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1px', marginBottom: '1rem' }}>
          Describe. <span style={{ color: 'var(--text-secondary)' }}>Generate.</span> Build.
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
          Prompt2MERN harnesses the power of AI to instantly scaffold fully functional MERN stack and React applications based on your natural language descriptions.
        </p>

        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'left' }}>
          {error && <div className="error-message mb-3">{error}</div>}

          <div className="form-group">
            <label className="form-label">Application Description</label>
            <textarea 
              placeholder="e.g. Build a task management app with user authentication, dark mode support, and drag-and-drop boards..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              style={{ resize: 'vertical' }}
              disabled={loading}
            />
          </div>

          <div className="form-group mb-4">
            <label className="form-label">Technology Stack</label>
            <select 
              value={stack} 
              onChange={(e) => setStack(e.target.value)}
              disabled={loading}
            >
              <option value="" disabled>Select a technology stack</option>
              <option value="mern">MERN Stack (MongoDB, Express, React, Node)</option>
              <option value="react">React Only (Frontend)</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={handleGenerate} 
              disabled={loading || !prompt || !stack}
              style={{ flex: 1, padding: '1rem' }}
            >
              {loading ? (
                <><span className="loader" style={{ width: '18px', height: '18px' }} /> Initializing...</>
              ) : "Generate Application"}
            </button>
          </div>
        </div>
      </div>

      {(status || generationId) && (
        <div className="status-box card fade-in">
          <h3 className="mb-3">Generation Status</h3>
          
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <span className={`badge badge-${status}`}>
              {status === 'processing' && <span className="loader" style={{ width: '12px', height: '12px', borderWidth: '2px', borderTopColor: '#fff', borderRightColor: 'transparent', borderBottomColor: 'transparent', borderLeftColor: 'transparent' }} />}
              {status}
            </span>
          </div>

          {status === 'processing' && (
            <p style={{ color: 'var(--text-secondary)' }}>
              The AI is currently building your application. This usually takes 1-3 minutes depending on complexity...
            </p>
          )}

          {status === 'completed' && (
            <div>
              <div className="success-message mb-4" style={{ display: 'inline-block' }}>
                ✓ Application generated successfully!
              </div>
              <br />
              <button onClick={handleDownload} style={{ padding: '1rem 2rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download ZIP Archive
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;