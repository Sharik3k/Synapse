const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Mock data for ideas/clusters
const mockClusters = {
  'cluster-1': {
    id: 'cluster-1',
    label: 'Artificial Intelligence',
    nodes: [
      { id: 'node-1', label: 'Machine Learning' },
      { id: 'node-2', label: 'Deep Learning' },
      { id: 'node-3', label: 'NLP' },
      { id: 'node-4', label: 'Computer Vision' },
    ],
    edges: [
      { from: 'node-1', to: 'node-2' },
      { from: 'node-1', to: 'node-3' },
      { from: 'node-1', to: 'node-4' },
    ]
  },
  'cluster-2': {
    id: 'cluster-2',
    label: 'Web Development',
    nodes: [
      { id: 'node-5', label: 'React.js' },
      { id: 'node-6', label: 'Node.js' },
      { id: 'node-7', label: 'GraphQL' },
    ],
    edges: [
      { from: 'node-5', to: 'node-6' },
      { from: 'node-6', to: 'node-7' },
    ]
  }
};

app.get('/api/clusters', (req, res) => {
  res.json(mockClusters);
});

app.post('/api/ideas', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const newNode = {
    id: `node-${Date.now()}`,
    label: text
  };

  // Add to the first cluster for simplicity
  mockClusters['cluster-1'].nodes.push(newNode);

  // Optional: create a random edge
  const nodesCount = mockClusters['cluster-1'].nodes.length;
  if (nodesCount > 1) {
    const randomNodeIndex = Math.floor(Math.random() * (nodesCount - 1));
    const randomNode = mockClusters['cluster-1'].nodes[randomNodeIndex];
    mockClusters['cluster-1'].edges.push({ from: newNode.id, to: randomNode.id });
  }

  res.status(201).json(mockClusters);
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
