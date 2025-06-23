
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Connection,
  Edge,
  Node,
  OnConnect,
  OnNodesChange,
  OnEdgesChange,
  ConnectionMode,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Plus, RotateCcw, Save, Layout, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TriggerNode from './nodes/TriggerNode';
import ActionNode from './nodes/ActionNode';
import RouterNode from './nodes/RouterNode';
import NodeSelectionModal from './NodeSelectionModal';
import { useToast } from '@/hooks/use-toast';

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  router: RouterNode,
};

export interface FlowData {
  nodes: any[];
  edges: any[];
  metadata: {
    layout: 'horizontal' | 'vertical';
    created_at: string;
    updated_at: string;
  };
  changes: {
    added_nodes: string[];
    deleted_nodes: string[];
    added_edges: string[];
    deleted_edges: string[];
    insertions: any[];
  };
}

const FlowBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [layout, setLayout] = useState<'horizontal' | 'vertical'>('horizontal');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [insertPosition, setInsertPosition] = useState<{ x: number; y: number } | null>(null);
  const [insertEdge, setInsertEdge] = useState<Edge | null>(null);
  const { toast } = useToast();
  
  // State tracking for backend
  const [flowData, setFlowData] = useState<FlowData>({
    nodes: [],
    edges: [],
    metadata: {
      layout: 'horizontal',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    changes: {
      added_nodes: [],
      deleted_nodes: [],
      added_edges: [],
      deleted_edges: [],
      insertions: [],
    },
  });

  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Track changes for backend compatibility
  const trackNodeAddition = (nodeId: string) => {
    setFlowData(prev => ({
      ...prev,
      changes: {
        ...prev.changes,
        added_nodes: [...prev.changes.added_nodes, nodeId],
      },
      metadata: {
        ...prev.metadata,
        updated_at: new Date().toISOString(),
      },
    }));
  };

  const trackNodeDeletion = (nodeId: string) => {
    setFlowData(prev => ({
      ...prev,
      changes: {
        ...prev.changes,
        deleted_nodes: [...prev.changes.deleted_nodes, nodeId],
      },
      metadata: {
        ...prev.metadata,
        updated_at: new Date().toISOString(),
      },
    }));
  };

  const trackEdgeAddition = (edgeId: string) => {
    setFlowData(prev => ({
      ...prev,
      changes: {
        ...prev.changes,
        added_edges: [...prev.changes.added_edges, edgeId],
      },
      metadata: {
        ...prev.metadata,
        updated_at: new Date().toISOString(),
      },
    }));
  };

  const trackEdgeDeletion = (edgeId: string) => {
    setFlowData(prev => ({
      ...prev,
      changes: {
        ...prev.changes,
        deleted_edges: [...prev.changes.deleted_edges, edgeId],
      },
      metadata: {
        ...prev.metadata,
        updated_at: new Date().toISOString(),
      },
    }));
  };

  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      const id = `edge-${Date.now()}`;
      const newEdge = { ...params, id, type: 'smoothstep' };
      setEdges((eds) => addEdge(newEdge, eds));
      trackEdgeAddition(id);
    },
    [setEdges]
  );

  const onNodesChangeHandler: OnNodesChange = useCallback(
    (changes) => {
      changes.forEach((change) => {
        if (change.type === 'remove') {
          trackNodeDeletion(change.id);
          // Remove connected edges
          setEdges((eds) => {
            const edgesToRemove = eds.filter(
              (edge) => edge.source === change.id || edge.target === change.id
            );
            edgesToRemove.forEach((edge) => trackEdgeDeletion(edge.id));
            return eds.filter(
              (edge) => edge.source !== change.id && edge.target !== change.id
            );
          });
        }
      });
      onNodesChange(changes);
    },
    [onNodesChange, setEdges]
  );

  const onEdgesChangeHandler: OnEdgesChange = useCallback(
    (changes) => {
      changes.forEach((change) => {
        if (change.type === 'remove') {
          trackEdgeDeletion(change.id);
        }
      });
      onEdgesChange(changes);
    },
    [onEdgesChange]
  );

  const addNode = (nodeData: any, position?: { x: number; y: number }) => {
    const id = `${nodeData.type}-${Date.now()}`;
    const newNode: Node = {
      id,
      type: nodeData.type,
      position: position || { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        label: nodeData.label,
        category: nodeData.category,
        ...nodeData,
      },
      sourcePosition: layout === 'horizontal' ? Position.Right : Position.Bottom,
      targetPosition: layout === 'horizontal' ? Position.Left : Position.Top,
    };

    setNodes((nds) => [...nds, newNode]);
    trackNodeAddition(id);

    // Handle insertion between nodes
    if (insertEdge && insertPosition) {
      handleNodeInsertion(newNode, insertEdge);
      setInsertEdge(null);
      setInsertPosition(null);
    }

    toast({
      title: "Node Added",
      description: `${nodeData.type} "${nodeData.label}" has been added to the flow.`,
    });
  };

  const handleNodeInsertion = (newNode: Node, originalEdge: Edge) => {
    // Remove the original edge
    setEdges((eds) => eds.filter((edge) => edge.id !== originalEdge.id));
    trackEdgeDeletion(originalEdge.id);

    // Create two new edges
    const edge1Id = `edge-${Date.now()}-1`;
    const edge2Id = `edge-${Date.now()}-2`;
    
    const edge1 = {
      id: edge1Id,
      source: originalEdge.source,
      target: newNode.id,
      type: 'smoothstep',
    };
    
    const edge2 = {
      id: edge2Id,
      source: newNode.id,
      target: originalEdge.target,
      type: 'smoothstep',
    };

    setEdges((eds) => [...eds, edge1, edge2]);
    trackEdgeAddition(edge1Id);
    trackEdgeAddition(edge2Id);

    // Track insertion for backend
    setFlowData(prev => ({
      ...prev,
      changes: {
        ...prev.changes,
        insertions: [...prev.changes.insertions, {
          node_id: newNode.id,
          original_edge: originalEdge.id,
          new_edges: [edge1Id, edge2Id],
          timestamp: new Date().toISOString(),
        }],
      },
    }));
  };

  const toggleLayout = () => {
    const newLayout = layout === 'horizontal' ? 'vertical' : 'horizontal';
    setLayout(newLayout);
    
    // Update node positions based on layout
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        sourcePosition: newLayout === 'horizontal' ? Position.Right : Position.Bottom,
        targetPosition: newLayout === 'horizontal' ? Position.Left : Position.Top,
      }))
    );

    setFlowData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        layout: newLayout,
        updated_at: new Date().toISOString(),
      },
    }));

    toast({
      title: "Layout Changed",
      description: `Flow layout changed to ${newLayout}.`,
    });
  };

  const saveFlow = () => {
    const finalFlowData = {
      ...flowData,
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data,
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type,
      })),
      metadata: {
        ...flowData.metadata,
        updated_at: new Date().toISOString(),
      },
    };

    console.log('Flow Data for Backend:', JSON.stringify(finalFlowData, null, 2));
    
    toast({
      title: "Flow Saved",
      description: "Automation flow has been saved successfully.",
    });
  };

  const onEdgeClick = (event: React.MouseEvent, edge: Edge) => {
    const rect = reactFlowWrapper.current?.getBoundingClientRect();
    if (rect) {
      setInsertPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
      setInsertEdge(edge);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-blue-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Grid3X3 className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-900">Automation Flow Builder</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            {nodes.filter(n => n.type === 'trigger').length} Triggers
          </Badge>
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            {nodes.filter(n => n.type === 'action').length} Actions
          </Badge>
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            {nodes.filter(n => n.type === 'router').length} Routers
          </Badge>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-blue-50 border-b border-blue-200 p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Node
          </Button>
          
          <Button
            onClick={toggleLayout}
            variant="outline"
            size="sm"
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <Layout className="h-4 w-4 mr-2" />
            {layout === 'horizontal' ? 'Horizontal' : 'Vertical'}
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={() => {
              setNodes([]);
              setEdges([]);
              setFlowData(prev => ({
                ...prev,
                changes: {
                  added_nodes: [],
                  deleted_nodes: [...prev.changes.deleted_nodes, ...nodes.map(n => n.id)],
                  added_edges: [],
                  deleted_edges: [...prev.changes.deleted_edges, ...edges.map(e => e.id)],
                  insertions: [],
                },
                metadata: {
                  ...prev.metadata,
                  updated_at: new Date().toISOString(),
                },
              }));
            }}
            variant="outline"
            size="sm"
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear
          </Button>
          
          <Button
            onClick={saveFlow}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Flow
          </Button>
        </div>
      </div>

      {/* Flow Canvas */}
      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChangeHandler}
          onEdgesChange={onEdgesChangeHandler}
          onConnect={onConnect}
          onEdgeClick={onEdgeClick}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
          className="bg-blue-50"
        >
          <Controls 
            className="bg-white border border-blue-200 rounded-lg shadow-sm"
            showInteractive={false}
          />
          <Background 
            color="#e0f2fe" 
            gap={20} 
            size={1}
            className="opacity-50"
          />
        </ReactFlow>
      </div>

      {/* Node Selection Modal */}
      <NodeSelectionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setInsertPosition(null);
          setInsertEdge(null);
        }}
        onSelectNode={(nodeData) => {
          addNode(nodeData, insertPosition || undefined);
          setIsModalOpen(false);
        }}
        insertMode={!!insertEdge}
      />
    </div>
  );
};

export default FlowBuilder;
