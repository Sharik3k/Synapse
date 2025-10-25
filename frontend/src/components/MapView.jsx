import React, { useEffect, useState, useRef } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';

// You might need to import layouts if you want more complex ones
// import coseBilkent from 'cytoscape-cose-bilkent';
// cytoscape.use(coseBilkent);

function MapView({ clusters, loading, onNodeTap }) {
  const [elements, setElements] = useState([]);
  const cyRef = useRef(null);

  useEffect(() => {
    if (clusters) {
      const allNodes = Object.values(clusters).flatMap(c => c.nodes || []);
      const nodes = allNodes.map(node => ({
        data: {
          id: node.id,
          label: node.label,
          // Safely calculate size, default to a base size
          size: 20 + Math.log((node.ideas?.length || 0) + 1) * 10
        }
      }));

      const allEdges = Object.values(clusters).flatMap(c => c.edges || []);
      const edges = allEdges.map(edge => ({
        data: {
          source: edge.from,
          target: edge.to
        }
      }));

      setElements([...nodes, ...edges]);
    }
  }, [clusters]);

  useEffect(() => {
    if (cyRef.current) {
      const cy = cyRef.current;

      // Clean up previous event listeners
      cy.removeAllListeners();

      // Click/Tap event
      cy.panningEnabled(false);

      cy.on('tap', 'node', (event) => {
        onNodeTap(event.target.id());
        const selectedNode = event.target;
        cy.elements().addClass('semitransparent');
        selectedNode.removeClass('semitransparent').addClass('highlighted');
        selectedNode.neighborhood().removeClass('semitransparent').addClass('highlighted');
      });

      // Hover events
      cy.on('mouseover', 'node', (event) => {
        event.target.addClass('hovered');
      });
      cy.on('mouseout', 'node', (event) => {
        event.target.removeClass('hovered');
      });

      // Tap background to reset
      cy.on('tap', (event) => {
        if (event.target === cy) {
          cy.elements().removeClass('semitransparent highlighted');
        }
      });
    }
  }, [onNodeTap, elements]); // Rerun when elements change

  const stylesheet = [
    {
      selector: 'node',
      style: {
        'background-color': 'var(--node-color)',
        'label': 'data(label)',
        'width': 'data(size)',
        'height': 'data(size)',
        'font-size': '10px',
        'color': 'var(--foreground)',
        'text-halign': 'center',
        'text-valign': 'center',
        'border-width': 2,
        'border-color': 'var(--node-color)',
        'transition-property': 'all',
        'transition-duration': '0.2s'
      }
    },
    {
        selector: 'node.hovered',
        style: {
          'transform': 'scale(1.1)',
          'border-color': '#fff',
        }
    },
    {
        selector: '.semitransparent',
        style: { 'opacity': 0.2 }
    },
    {
        selector: '.highlighted',
        style: { 'opacity': 1 }
    },
    {
        selector: 'node:selected',
        style: {
            'background-color': 'var(--accent)',
            'border-color': 'var(--accent)',
            'transform': 'scale(1.2)',
        }
    },
    {
      selector: 'edge',
      style: {
        'width': 1,
        'line-color': 'var(--edge-color)',
        'transition-property': 'opacity',
        'transition-duration': '0.2s'
      }
    }
  ];

  const layout = {
    name: 'cose',
    idealEdgeLength: 100,
    nodeOverlap: 20,
    refresh: 20,
    fit: true,
    padding: 30,
    randomize: true,
    componentSpacing: 100,
    nodeRepulsion: 400000,
    edgeElasticity: 100,
    nestingFactor: 5,
    gravity: 80,
    numIter: 1000,
    initialTemp: 200,
    coolingFactor: 0.95,
    minTemp: 1.0
  };

  return (
    <div className="map-view-container">
      {loading && <div className="loading-overlay">Loading...</div>}
      <CytoscapeComponent
        elements={CytoscapeComponent.normalizeElements(elements)}
        style={{ width: '100%', height: '100%' }}
        stylesheet={stylesheet}
        layout={layout}
        cy={(cy) => { cyRef.current = cy; }}
      />
    </div>
  );
}

export default MapView;
