import React from 'react';

function ClusterPanel({ cluster, onClose }) {
  if (!cluster) return null;

  return (
    <div className="cluster-panel-overlay" onClick={onClose}>
      <div className="cluster-panel-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <h2>{cluster.label || 'Cluster Details'}</h2>
        <div className="summary-section">
          <h4>Summary</h4>
          <p>{cluster.summary}</p>
        </div>
        <div className="members-section">
          <h4>Ideas in this cluster ({cluster.members.length})</h4>
          <ul>
            {cluster.members.map((idea, index) => (
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

export default ClusterPanel;
