import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Footer from './components/Footer';
import MainApp from './components/MainApp';
import SummaryModal from './components/SummaryModal';
import './App.css';

import { Sun, Moon } from 'lucide-react';

function App() {
  const [theme, setTheme] = useState('dark');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [clusters, setClusters] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [processing, setProcessing] = useState(false);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const API_URL = 'http://localhost:5000';

  const fetchClusters = useCallback(async () => {
    console.log('Fetching clusters...');
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/clusters`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setClusters(data);
    } catch (e) {
      console.error("Failed to fetch clusters:", e);
      setError('Could not load cluster data. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchClusters();
    }
  }, [isAuthenticated]); // Removed fetchClusters from dependencies to avoid re-fetching on every render

  const handleProcessRequest = async () => {
    console.log('Processing clusters...');
    setProcessing(true);
    try {
      const response = await fetch(`${API_URL}/process`, { method: 'POST' });
      if (!response.ok) throw new Error('Failed to start processing');
      setTimeout(() => {
        fetchClusters().finally(() => setProcessing(false));
      }, 3000); // Wait for processing
    } catch (e) {
      console.error("Failed to process clusters:", e);
      setError('Failed to process clusters.');
      setProcessing(false);
    }
  };

  const handleAddIdea = async (text) => {
    try {
      const response = await fetch(`${API_URL}/api/ideas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: 'demo_user', text }),
      });
      if (!response.ok) throw new Error('Failed to add idea');
      const data = await response.json();
      setClusters(data); // Update clusters with the new data from backend
    } catch (e) {
      console.error("Failed to add idea:", e);
      setError('Failed to add idea.');
    }
  };

  const handleNodeTap = (id) => {
    setSelectedCluster(id);
  };

  const handleClosePanel = () => {
    setSelectedCluster(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="App" data-theme={theme}>
        <Header onJoin={() => setIsAuthenticated(true)} theme={theme} toggleTheme={toggleTheme} />
        <LandingPage onJoin={() => setIsAuthenticated(true)} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="App" data-theme={theme}>
      <Header onJoin={() => setIsAuthenticated(true)} theme={theme} toggleTheme={toggleTheme} />
      <div className="app-content">
        <MainApp 
          clusters={clusters}
          loading={loading}
          error={error}
          selectedCluster={selectedCluster}
          handleNodeTap={handleNodeTap}
          handleClosePanel={handleClosePanel}
          onAddIdea={handleAddIdea}
          api_url={API_URL}
        />
        <SummaryModal 
          cluster={selectedCluster ? clusters[selectedCluster] : null}
          onClose={handleClosePanel} 
        />
      </div>
      <Footer />
    </div>
  );
}

export default App;
