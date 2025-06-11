import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import type { ApiHypergraphState, ApiAtom, ApiRelation } from '../services/apiClient';

interface Node {
  id: string;
  name: string;
  type: 'atom' | 'relation';
  color: string;
  size: number;
}

interface Link {
  source: string;
  target: string;
  type: 'binary' | 'hyperedge';
  color: string;
  width: number;
}

interface HypergraphVisualizerProps {
  hypergraphState: ApiHypergraphState | null;
  width?: number;
  height?: number;
}

const HypergraphVisualizer: React.FC<HypergraphVisualizerProps> = ({
  hypergraphState,
  width = 800,
  height = 600
}) => {
  const fgRef = useRef<any>(null);

  // Convert hypergraph state to force graph data
  const graphData = useMemo(() => {
    if (!hypergraphState) {
      return { nodes: [], links: [] };
    }

    const nodes: Node[] = [];
    const links: Link[] = [];

    // Add atom nodes
    hypergraphState.atoms.forEach((atom: ApiAtom) => {
      nodes.push({
        id: atom.id,
        name: atom.id,
        type: 'atom',
        color: '#3498db',
        size: 8
      });
    });

    // Add relation nodes and links
    hypergraphState.relations.forEach((relation: ApiRelation, index: number) => {
      if (relation.atomIds.length === 2) {
        // Binary relation: direct link between atoms
        links.push({
          source: relation.atomIds[0],
          target: relation.atomIds[1],
          type: 'binary',
          color: '#e74c3c',
          width: 2
        });
      } else if (relation.atomIds.length > 2) {
        // Ternary+ relation: create a central relation node
        const relationNodeId = `rel_${index}`;
        nodes.push({
          id: relationNodeId,
          name: `R${index}`,
          type: 'relation',
          color: '#e67e22',
          size: 6
        });

        // Connect all atoms to the central relation node
        relation.atomIds.forEach(atomId => {
          links.push({
            source: atomId,
            target: relationNodeId,
            type: 'hyperedge',
            color: '#95a5a6',
            width: 1
          });
        });
      }
    });

    return { nodes, links };
  }, [hypergraphState]);

  // Node rendering
  const nodeCanvasObject = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.name;
    const fontSize = 12 / globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;
    const textWidth = ctx.measureText(label).width;
    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

    // Draw node circle
    ctx.fillStyle = node.color;
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI, false);
    ctx.fill();

    // Draw node border
    ctx.strokeStyle = node.type === 'atom' ? '#2980b9' : '#d35400';
    ctx.lineWidth = 1 / globalScale;
    ctx.stroke();

    // Draw label background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(
      node.x - bckgDimensions[0] / 2,
      node.y - bckgDimensions[1] / 2,
      bckgDimensions[0],
      bckgDimensions[1]
    );

    // Draw label text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#2c3e50';
    ctx.fillText(label, node.x, node.y);
  }, []);

  // Link rendering
  const linkCanvasObject = useCallback((link: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const MAX_FONT_SIZE = 4;
    const LABEL_NODE_MARGIN = 1;

    const start = link.source;
    const end = link.target;

    // ignore unbound links
    if (typeof start !== 'object' || typeof end !== 'object') return;

    // calculate label positioning
    const textPos = {
      x: start.x + (end.x - start.x) / 2,
      y: start.y + (end.y - start.y) / 2
    };

    const relLink = { x: end.x - start.x, y: end.y - start.y };

    const maxTextLength = Math.sqrt(Math.pow(relLink.x, 2) + Math.pow(relLink.y, 2)) - LABEL_NODE_MARGIN * 2;

    let textAngle = Math.atan2(relLink.y, relLink.x);
    // maintain label vertical orientation for legibility
    if (textAngle > Math.PI / 2) textAngle = -(Math.PI - textAngle);
    if (textAngle < -Math.PI / 2) textAngle = -(-Math.PI - textAngle);

    const label = link.type === 'binary' ? '' : 'H'; // Only show labels for hyperedges

    // estimate fontSize to fit in link length
    ctx.font = '1px Sans-Serif';
    const fontSize = Math.min(MAX_FONT_SIZE, maxTextLength / ctx.measureText(label).width);
    ctx.font = `${fontSize}px Sans-Serif`;
    const textWidth = ctx.measureText(label).width;
    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

    // draw text label (if text fits in link)
    if (fontSize > 0 && textWidth <= maxTextLength && label) {
      ctx.save();
      ctx.translate(textPos.x, textPos.y);
      ctx.rotate(textAngle);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillRect(- bckgDimensions[0] / 2, - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#2c3e50';
      ctx.fillText(label, 0, 0);
      ctx.restore();
    }
  }, []);

  // Auto-zoom to fit graph when data changes
  useEffect(() => {
    if (fgRef.current && graphData.nodes.length > 0) {
      // Small delay to ensure nodes are positioned
      setTimeout(() => {
        fgRef.current?.zoomToFit(400, 50);
      }, 100);
    }
  }, [graphData]);

  return (
    <div className="hypergraph-visualizer" style={{ width, height, border: '1px solid #bdc3c7', borderRadius: '4px' }}>
      {hypergraphState ? (
        <ForceGraph2D
          ref={fgRef}
          graphData={graphData}
          width={width}
          height={height}
          nodeCanvasObject={nodeCanvasObject}
          linkCanvasObject={linkCanvasObject}
          nodeLabel="name"
          linkLabel={(link: any) => `${link.type}: ${link.source.id} → ${link.target.id}`}
          nodeColor={(node: any) => node.color}
          linkColor={(link: any) => link.color}
          linkWidth={(link: any) => link.width}
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.01}
          linkDirectionalParticleWidth={2}
          backgroundColor="#ecf0f1"
          cooldownTicks={100}
          onEngineStop={() => fgRef.current?.zoomToFit(400, 50)}
          enableNodeDrag={true}
          enableZoomInteraction={true}
          enablePanInteraction={true}
        />
      ) : (
        <div 
          style={{ 
            width, 
            height, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: '#ecf0f1',
            color: '#7f8c8d',
            fontSize: '18px'
          }}
        >
          Initialize simulation to see hypergraph
        </div>
      )}
    </div>
  );
};

export default HypergraphVisualizer; 