import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './InteractiveMap.css';

function InteractiveMap() {
  const { t } = useTranslation();
  const mapContainer = useRef(null);
  const nodes = useRef(new window.vis.DataSet([
    { id: 1, label: 'Ідея 1' },
    { id: 2, label: 'Ідея 2' },
    { id: 3, label: 'Ідея 3' },
  ]));
  const edges = useRef(new window.vis.DataSet([
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 3 },
  ]));

  useEffect(() => {
    const data = { nodes: nodes.current, edges: edges.current };
    const options = {
      physics: {
        enabled: true,
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
          gravitationalConstant: -50,
          centralGravity: 0.01,
          springLength: 100,
          springConstant: 0.08,
        },
      },
      interaction: {
        dragNodes: true,
        zoomView: true,
      },
      nodes: {
        shape: 'dot',
        color: '#fff',
        font: { color: '#fff' },
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

  const addIdea = () => {
    const newNodeId = nodes.current.length + 1;
    const newNode = { id: newNodeId, label: 'Ідея ' + newNodeId };
    nodes.current.add(newNode);

    const existingNodes = nodes.current.get({ fields: ['id'] });
    const newEdges = existingNodes
      .filter(node => node.id !== newNodeId)
      .map(node => ({ from: newNodeId, to: node.id }));

    edges.current.add(newEdges);
  };

  return (
    <section id="interactive-map" className="interactive-map-section">
      <h2>{t('interactive_map_title')}</h2>
      <p>{t('interactive_map_subtitle')}</p>
      <div id="idea-map" ref={mapContainer} className="idea-map-container"></div>
      <button id="add-idea-btn" onClick={addIdea} className="add-idea-button">
        {t('add_idea')}
      </button>
    </section>
  );
}

export default InteractiveMap;
