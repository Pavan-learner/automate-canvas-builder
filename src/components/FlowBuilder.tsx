
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
  EdgeProps,
  BaseEdge,
  getBezierPath,
  EdgeLabelRenderer,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Plus, RotateCcw, Save, Layout, Grid3X3, Send, Trash2, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TriggerNode from './nodes/TriggerNode';
import ActionNode from './nodes/ActionNode';
import RouterNode from './nodes/RouterNode';
import NodeSelectionModal from './NodeSelectionModal';
import EditNodeModal from './EditNodeModal';
import ExistingNodeModal from './ExistingNodeModal';
import { useToast } from '@/hooks/use-toast';
import { automationService, AutomationData } from '@/services/automationService';

// Custom Edge with Better Delete Options
const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) => {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    // Dispatch custom event for edge deletion options
    window.dispatchEvent(new CustomEvent('edgeDeleteOptions', { detail: { edgeId: id } }));
  };

  return (
    <>
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{ 
          ...style, 
          stroke: '#3b82f6', 
          strokeWidth: 2,
          filter: 'drop-shadow(0 1px 2px rgba(59, 130, 246, 0.2))'
        }} 
      />
      <EdgeLabelRenderer>
        <div
          className="absolute pointer-events-all transform -translate-x-1/2 -translate-y-1/2"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          <Button
            size="sm"
            variant="destructive"
            className="h-6 w-6 p-0 rounded-full text-xs bg-red-500 hover:bg-red-600 shadow-md border-2 border-white"
            onClick={onEdgeClick}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  router: RouterNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

const FlowBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [layout, setLayout] = useState<'horizontal' | 'vertical'>('horizontal');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isExistingNodeModalOpen, setIsExistingNodeModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<any>(null);
  const [insertPosition, setInsertPosition] = useState<{ x: number; y: number } | null>(null);
  const [insertEdge, setInsertEdge] = useState<Edge | null>(null);
  const [pendingEdgeId, setPendingEdgeId] = useState<string | null>(null);
  const [currentAutomationId, setCurrentAutomationId] = useState<string>('');
  const [automationName, setAutomationName] = useState<string>('');
  const [savedAutomations, setSavedAutomations] = useState<AutomationData[]>([]);
  const { toast } = useToast();

  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Load saved automations on component mount
  useEffect(() => {
    const automations = automationService.getAllAutomations();
    setSavedAutomations(automations);
  }, []);

  // Custom event listeners for node actions and edge deletion
  useEffect(() => {
    const handleEditNode = (event: any) => {
      const { id, data, type } = event.detail;
      setEditingNode({ id, data, type });
      setIsEditModalOpen(true);
    };

    const handleToggleNode = (event: any) => {
      const { id, enabled } = event.detail;
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, enabled } }
            : node
        )
      );
      toast({
        title: enabled ? "Node Enabled" : "Node Disabled",
        description: `Node has been ${enabled ? 'enabled' : 'disabled'}.`,
      });
    };

    const handleEdgeDeleteOptions = (event: any) => {
      setPendingEdgeId(event.detail.edgeId);
      
      // Show confirmation dialog with options
      const result = window.confirm(
        'Choose an option:\n' +
        'OK - Delete edge and connect to existing node\n' +
        'Cancel - Delete edge only'
      );
      
      if (result) {
        // User wants to connect to existing node
        setIsExistingNodeModalOpen(true);
      } else {
        // User wants to delete edge only
        setEdges((eds) => eds.filter((edge) => edge.id !== event.detail.edgeId));
        setPendingEdgeId(null);
        toast({
          title: "Edge Deleted",
          description: "Connection has been removed.",
        });
      }
    };

    window.addEventListener('editNode', handleEditNode);
    window.addEventListener('toggleNode', handleToggleNode);
    window.addEventListener('edgeDeleteOptions', handleEdgeDeleteOptions);

    return () => {
      window.removeEventListener('editNode', handleEditNode);
      window.removeEventListener('toggleNode', handleToggleNode);
      window.removeEventListener('edgeDeleteOptions', handleEdgeDeleteOptions);
    };
  }, [setNodes, setEdges, toast]);

  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      const id = `edge-${Date.now()}`;
      const newEdge = { ...params, id, type: 'custom' };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const onNodesChangeHandler: OnNodesChange = useCallback(
    (changes) => {
      changes.forEach((change) => {
        if (change.type === 'remove') {
          setEdges((eds) => 
            eds.filter((edge) => edge.source !== change.id && edge.target !== change.id)
          );
        }
      });
      onNodesChange(changes);
    },
    [onNodesChange, setEdges]
  );

  const onEdgesChangeHandler: OnEdgesChange = useCallback(
    (changes) => {
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
        enabled: true,
        ...nodeData,
      },
      sourcePosition: layout === 'horizontal' ? Position.Right : Position.Bottom,
      targetPosition: layout === 'horizontal' ? Position.Left : Position.Top,
    };

    setNodes((nds) => [...nds, newNode]);

    // Auto-connect to last node if nodes exist and no insertion mode
    if (!insertEdge && !insertPosition && nodes.length > 0) {
      const lastNode = nodes[nodes.length - 1];
      if (lastNode.type !== 'router' || nodeData.type === 'trigger') {
        const edgeId = `edge-${Date.now()}-auto`;
        const autoEdge = {
          id: edgeId,
          source: nodeData.type === 'trigger' ? id : lastNode.id,
          target: nodeData.type === 'trigger' ? lastNode.id : id,
          type: 'custom',
        };
        setEdges((eds) => [...eds, autoEdge]);
      }
    }

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

    // Create two new edges
    const edge1Id = `edge-${Date.now()}-1`;
    const edge2Id = `edge-${Date.now()}-2`;
    
    const edge1 = {
      id: edge1Id,
      source: originalEdge.source,
      target: newNode.id,
      type: 'custom',
    };
    
    const edge2 = {
      id: edge2Id,
      source: newNode.id,
      target: originalEdge.target,
      type: 'custom',
    };

    setEdges((eds) => [...eds, edge1, edge2]);
  };

  const handleExistingNodeSelection = (nodeId: string) => {
    if (pendingEdgeId) {
      const oldEdge = edges.find(e => e.id === pendingEdgeId);
      if (oldEdge) {
        // Remove old edge
        setEdges((eds) => eds.filter((edge) => edge.id !== pendingEdgeId));
        
        // Create new edge to selected node
        const newEdgeId = `edge-${Date.now()}-reconnect`;
        const newEdge = {
          id: newEdgeId,
          source: oldEdge.source,
          target: nodeId,
          type: 'custom',
        };
        
        setEdges((eds) => [...eds, newEdge]);
        
        toast({
          title: "Edge Reconnected",
          description: "Connection has been redirected to the selected node.",
        });
      }
    }
    
    setIsExistingNodeModalOpen(false);
    setPendingEdgeId(null);
  };

  const toggleLayout = () => {
    const newLayout = layout === 'horizontal' ? 'vertical' : 'horizontal';
    setLayout(newLayout);
    
    // Rearrange nodes based on layout
    setNodes((nds) =>
      nds.map((node, index) => {
        let newPosition;
        if (newLayout === 'horizontal') {
          newPosition = {
            x: index * 280 + 100,
            y: 200 + (Math.random() - 0.5) * 80,
          };
        } else {
          newPosition = {
            x: 250 + (Math.random() - 0.5) * 80,
            y: index * 180 + 100,
          };
        }
        
        return {
          ...node,
          position: newPosition,
          sourcePosition: newLayout === 'horizontal' ? Position.Right : Position.Bottom,
          targetPosition: newLayout === 'horizontal' ? Position.Left : Position.Top,
        };
      })
    );

    toast({
      title: "Layout Changed",
      description: `Flow layout changed to ${newLayout} with nodes repositioned.`,
    });
  };

  const saveFlow = () => {
    if (!automationName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for your automation.",
        variant: "destructive",
      });
      return;
    }

    const automationData: AutomationData = {
      id: currentAutomationId || automationService.generateId(),
      name: automationName,
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
        layout,
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
    };

    automationService.saveAutomation(automationData);
    setCurrentAutomationId(automationData.id);
    setSavedAutomations(automationService.getAllAutomations());
    
    toast({
      title: "Automation Saved",
      description: `"${automationName}" has been saved successfully.`,
    });
  };

  const loadAutomation = (automationId: string) => {
    const automation = automationService.getAutomation(automationId);
    if (automation) {
      setCurrentAutomationId(automation.id);
      setAutomationName(automation.name);
      setLayout(automation.metadata.layout);
      
      // Load nodes
      const loadedNodes = automation.nodes.map(node => ({
        ...node,
        sourcePosition: automation.metadata.layout === 'horizontal' ? Position.Right : Position.Bottom,
        targetPosition: automation.metadata.layout === 'horizontal' ? Position.Left : Position.Top,
      }));
      setNodes(loadedNodes);
      
      // Load edges
      setEdges(automation.edges);
      
      toast({
        title: "Automation Loaded",
        description: `"${automation.name}" has been loaded successfully.`,
      });
    }
  };

  const newAutomation = () => {
    setCurrentAutomationId('');
    setAutomationName('');
    setNodes([]);
    setEdges([]);
    setLayout('horizontal');
    
    toast({
      title: "New Automation",
      description: "Started a new automation flow.",
    });
  };

  const sendToBackend = async () => {
    const automationData = {
      id: currentAutomationId,
      name: automationName,
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
        layout,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };

    try {
      console.log('Sending to backend:', automationData);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResponse = {
        status: 'success',
        message: 'Automation processed successfully',
        automation_id: automationData.id || `auto_${Date.now()}`,
        processed_nodes: automationData.nodes.length,
        processed_edges: automationData.edges.length,
        execution_plan: automationData.nodes.map(node => ({
          node_id: node.id,
          type: node.type,
          category: node.data?.category || 'default',
          enabled: node.data?.enabled !== false,
          estimated_execution_time: Math.random() * 1000 + 100,
        })),
        validation: {
          errors: [],
          warnings: nodes.filter(n => !n.data?.enabled).length > 0 ? 
            [`${nodes.filter(n => !n.data?.enabled).length} nodes are disabled`] : []
        }
      };
      
      console.log('Backend Response:', mockResponse);
      
      toast({
        title: "Backend Response Received",
        description: `Automation processed: ${mockResponse.processed_nodes} nodes, ${mockResponse.processed_edges} edges.`,
      });
    } catch (error) {
      console.error('Backend Error:', error);
      toast({
        title: "Backend Error",
        description: "Failed to send data to backend.",
        variant: "destructive",
      });
    }
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

  const handleEditNodeSave = (updatedData: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === editingNode.id
          ? { ...node, data: { ...node.data, ...updatedData } }
          : node
      )
    );
    toast({
      title: "Node Updated",
      description: "Node has been updated successfully.",
    });
  };

  // Calculate active nodes
  const activeNodes = nodes.filter(node => node.data?.enabled !== false);
  const activeTriggers = activeNodes.filter(node => node.type === 'trigger').length;
  const activeActions = activeNodes.filter(node => node.type === 'action').length;
  const activeRouters = activeNodes.filter(node => node.type === 'router').length;

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-blue-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Grid3X3 className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-blue-900">Automation Flow Builder</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Label htmlFor="automation-name" className="text-blue-700">Name:</Label>
            <Input
              id="automation-name"
              value={automationName}
              onChange={(e) => setAutomationName(e.target.value)}
              placeholder="Enter automation name"
              className="w-48 border-blue-200 focus:border-blue-400"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
            {activeTriggers} Triggers
          </Badge>
          <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
            {activeActions} Actions
          </Badge>
          <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
            {activeRouters} Routers
          </Badge>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-blue-50 border-b border-blue-200 p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            onClick={newAutomation}
            variant="outline"
            size="sm"
            className="border-blue-200 text-blue-600 hover:bg-blue-100"
          >
            <Plus className="h-4 w-4 mr-2" />
            New
          </Button>
          
          <Select value={currentAutomationId} onValueChange={loadAutomation}>
            <SelectTrigger className="w-48 border-blue-200">
              <SelectValue placeholder="Load automation..." />
            </SelectTrigger>
            <SelectContent className="bg-white border-blue-200">
              {savedAutomations.map((automation) => (
                <SelectItem key={automation.id} value={automation.id}>
                  {automation.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
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
            className="border-blue-200 text-blue-600 hover:bg-blue-100"
          >
            <Layout className="h-4 w-4 mr-2" />
            {layout === 'horizontal' ? 'Vertical' : 'Horizontal'}
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={sendToBackend}
            className="bg-green-600 hover:bg-green-700 text-white"
            size="sm"
          >
            <Send className="h-4 w-4 mr-2" />
            Send to Backend
          </Button>
          
          <Button
            onClick={() => {
              setNodes([]);
              setEdges([]);
            }}
            variant="outline"
            size="sm"
            className="border-blue-200 text-blue-600 hover:bg-blue-100"
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
            Save
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
          edgeTypes={edgeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
          className="bg-blue-50"
        >
          <Controls 
            className="bg-white border border-blue-200 rounded-lg shadow-sm"
            showInteractive={false}
          />
          <Background 
            color="#bfdbfe" 
            gap={20} 
            size={1}
            className="opacity-30"
          />
        </ReactFlow>
      </div>

      {/* Modals */}
      <NodeSel-ectionModal
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

      <EditNodeModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingNode(null);
        }}
        onSave={handleEditNodeSave}
        nodeData={editingNode?.data}
        nodeType={editingNode?.type}
      />

      <ExistingNodeModal
        isOpen={isExistingNodeModalOpen}
        onClose={() => {
          setIsExistingNodeModalOpen(false);
          setPendingEdgeId(null);
        }}
        onSelectNode={handleExistingNodeSelection}
        nodes={nodes}
      />
    </div>
  );
};

export default FlowBuilder;
