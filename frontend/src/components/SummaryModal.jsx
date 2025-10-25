import React from 'react';
import './SummaryModal.css';

function SummaryModal({ cluster, onClose }) {
  if (!cluster) return null;

  // Mock data if not present
  const summary = cluster.summary || 'This is a summary of the cluster. It contains several related ideas.';
  const members = cluster.members || [
    { user: 'user1', text: 'An idea about machine learning.', created_at: new Date().toISOString() },
    { user: 'user2', text: 'Another thought on AI.', created_at: new Date().toISOString() },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <h2>{cluster.label || 'Cluster Details'}</h2>
        <div className="summary-section">
          <h4>Summary</h4>
          <p>{summary}</p>
        </div>
        <div className="members-section">
          <h4>Ideas in this cluster ({members.length})</h4>
          <ul>
            {members.map((idea, index) => (
              <li key={index}>
                <strong>{idea.user}:</strong> {idea.text}
                <small>{new Date(idea.created_at).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SummaryModal;