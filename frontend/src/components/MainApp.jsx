import React from 'react';
import { useTranslation } from 'react-i18next';
import IdeaInput from './IdeaInput';
import MapView from './MapView';
import ClusterPanel from './ClusterPanel';
import { SlidersHorizontal, Search, Zap, Send } from 'lucide-react';
import './MainApp.css';

function MainApp({ 
  clusters, 
  loading, 
  error, 
  selectedCluster, 
  handleNodeTap, 
  handleClosePanel, 
  onAddIdea, 
  api_url 
}) {
  const { t } = useTranslation();

  return (
    <div className="main-app-grid">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Zap size={20} />
          <h2>Synapse Control</h2>
        </div>
        <IdeaInput api_url={api_url} />
                <div className="idea-list">
          {/* Placeholder for idea list */}
          <p className="placeholder-text">Your ideas will appear here.</p>
        </div>
        <div className="toolbar">
          <div className="search-bar">
            <Search size={16} />
            <input type="text" placeholder="Find idea..." />
          </div>
          <div className="toggles">
            <label><input type="checkbox" /> Freeze Physics</label>
            <label><input type="checkbox" /> Show Edges</label>
          </div>
        </div>
      </aside>
      <main className={`map-view-wrapper ${error ? 'has-error' : ''}`}>
        {error && <div className="error-container"><p>{error}</p></div>}
        <MapView 
          clusters={clusters} 
          loading={loading} 
          onNodeTap={handleNodeTap} 
        />
        {selectedCluster && (
          <ClusterPanel 
            cluster={clusters[selectedCluster]} 
            onClose={handleClosePanel} 
          />
        )}
      </main>
    </div>
  );
}

export default MainApp;
