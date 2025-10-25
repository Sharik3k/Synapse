import React, { useEffect, useRef } from 'react';
import './HeroMap.css';

function HeroMap() {
  const mapContainer = useRef(null);

  useEffect(() => {
    const nodes = new window.vis.DataSet();
    const edges = new window.vis.DataSet();

    // Create a grid of nodes
    const nodeCount = 15;
    for (let i = 0; i < nodeCount; i++) {
      nodes.add({ id: i });
    }

    // Create random edges
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (Math.random() > 0.8) {
          edges.add({ from: i, to: j });
        }
      }
    }

    const data = { nodes, edges };
    const options = {
      physics: {
        enabled: true,
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
          gravitationalConstant: -20,
          centralGravity: 0.005,
          springLength: 100,
          springConstant: 0.08,
        },
        maxVelocity: 146,
        minVelocity: 0.1,
        timestep: 0.35,
      },
      interaction: {
        dragNodes: false,
        dragView: false,
        zoomView: false,
      },
      nodes: {
        shape: 'dot',
        size: 3,
        color: {
          background: '#fff',
          border: '#fff',
        },
        borderWidth: 2,
      },
      edges: {
        color: '#333',
        width: 1,
      },
    };

    const network = new window.vis.Network(mapContainer.current, data, options);

    return () => {
      network.destroy();
    };
  }, []);

  return <div ref={mapContainer} className="hero-map-container"></div>;
}

export default HeroMap;
