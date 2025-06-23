
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Zap, Play, GitBranch, Mail, Clock, MousePointer, MessageSquare, Database, Webhook } from 'lucide-react';

interface NodeData {
  type: 'trigger' | 'action' | 'router';
  category: string;
  label: string;
  description: string;
}

interface NodeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNode: (nodeData: NodeData) => void;
  insertMode?: boolean;
}

const TRIGGERS: NodeData[] = [
  {
    type: 'trigger',
    category: 'email',
    label: 'Email Received',
    description: 'Triggers when a new email is received'
  },
  {
    type: 'trigger',
    category: 'email',
    label: 'Email Opened',
    description: 'Triggers when an email is opened by recipient'
  },
  {
    type: 'trigger',
    category: 'time',
    label: 'Schedule',
    description: 'Triggers at specific time intervals'
  },
  {
    type: 'trigger',
    category: 'time',
    label: 'Date Reached',
    description: 'Triggers when a specific date is reached'
  },
  {
    type: 'trigger',
    category: 'event',
    label: 'Form Submission',
    description: 'Triggers when a form is submitted'
  },
  {
    type: 'trigger',
    category: 'event',
    label: 'Page Visit',
    description: 'Triggers when a specific page is visited'
  },
];

const ACTIONS: NodeData[] = [
  {
    type: 'action',
    category: 'email',
    label: 'Send Email',
    description: 'Send an email to specified recipients'
  },
  {
    type: 'action',
    category: 'email',
    label: 'Add to List',
    description: 'Add contact to email list'
  },
  {
    type: 'action',
    category: 'sms',
    label: 'Send SMS',
    description: 'Send SMS message to phone number'
  },
  {
    type: 'action',
    category: 'database',
    label: 'Update Contact',
    description: 'Update contact information in database'
  },
  {
    type: 'action',
    category: 'database',
    label: 'Create Record',
    description: 'Create new record in database'
  },
  {
    type: 'action',
    category: 'webhook',
    label: 'Send Webhook',
    description: 'Send HTTP request to external service'
  },
];

const ROUTERS: NodeData[] = [
  {
    type: 'router',
    category: 'conditional',
    label: 'If/Then Router',
    description: 'Route based on conditional logic'
  },
  {
    type: 'router',
    category: 'parallel',
    label: 'Parallel Router',
    description: 'Execute multiple paths simultaneously'
  },
  {
    type: 'router',
    category: 'random',
    label: 'Random Router',
    description: 'Randomly select one of multiple paths'
  },
];

const NodeSelectionModal = ({ isOpen, onClose, onSelectNode, insertMode = false }: NodeSelectionModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('triggers');

  const getIcon = (type: string, category: string) => {
    if (type === 'router') return <GitBranch className="h-4 w-4" />;
    if (type === 'trigger') {
      switch (category) {
        case 'email': return <Mail className="h-4 w-4" />;
        case 'time': return <Clock className="h-4 w-4" />;
        case 'event': return <MousePointer className="h-4 w-4" />;
        default: return <Zap className="h-4 w-4" />;
      }
    }
    if (type === 'action') {
      switch (category) {
        case 'email': return <Mail className="h-4 w-4" />;
        case 'sms': return <MessageSquare className="h-4 w-4" />;
        case 'database': return <Database className="h-4 w-4" />;
        case 'webhook': return <Webhook className="h-4 w-4" />;
        default: return <Play className="h-4 w-4" />;
      }
    }
    return <Play className="h-4 w-4" />;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'email':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'time':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'event':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'sms':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'database':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'webhook':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'conditional':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'parallel':
        return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      case 'random':
        return 'bg-pink-100 text-pink-700 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filterNodes = (nodes: NodeData[]) => {
    return nodes.filter(node =>
      node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const NodeCard = ({ node }: { node: NodeData }) => (
    <Card 
      className="p-4 cursor-pointer hover:bg-blue-50 transition-colors border border-blue-200 hover:border-blue-300"
      onClick={() => onSelectNode(node)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2 text-blue-700">
          {getIcon(node.type, node.category)}
          <span className="font-medium text-sm uppercase">{node.type}</span>
        </div>
        <Badge className={`text-xs ${getCategoryColor(node.category)}`}>
          {node.category}
        </Badge>
      </div>
      
      <div className="text-gray-900 font-medium text-sm mb-1">
        {node.label}
      </div>
      
      <div className="text-gray-600 text-xs">
        {node.description}
      </div>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl text-gray-900">
            {insertMode ? 'Insert Node' : 'Add Node to Flow'}
          </DialogTitle>
          {insertMode && (
            <p className="text-sm text-gray-600">
              Select a node to insert between the connected nodes.
            </p>
          )}
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search nodes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-blue-200 focus:border-blue-400"
            />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 bg-blue-50">
              <TabsTrigger value="triggers" className="text-blue-700 data-[state=active]:bg-white">
                Triggers ({filterNodes(TRIGGERS).length})
              </TabsTrigger>
              <TabsTrigger value="actions" className="text-blue-700 data-[state=active]:bg-white">
                Actions ({filterNodes(ACTIONS).length})
              </TabsTrigger>
              <TabsTrigger value="routers" className="text-blue-700 data-[state=active]:bg-white">
                Routers ({filterNodes(ROUTERS).length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="triggers" className="space-y-3 max-h-96 overflow-y-auto">
              {filterNodes(TRIGGERS).map((node, index) => (
                <NodeCard key={index} node={node} />
              ))}
              {filterNodes(TRIGGERS).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No triggers found matching your search.
                </div>
              )}
            </TabsContent>

            <TabsContent value="actions" className="space-y-3 max-h-96 overflow-y-auto">
              {filterNodes(ACTIONS).map((node, index) => (
                <NodeCard key={index} node={node} />
              ))}
              {filterNodes(ACTIONS).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No actions found matching your search.
                </div>
              )}
            </TabsContent>

            <TabsContent value="routers" className="space-y-3 max-h-96 overflow-y-auto">
              {filterNodes(ROUTERS).map((node, index) => (
                <NodeCard key={index} node={node} />
              ))}
              {filterNodes(ROUTERS).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No routers found matching your search.
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Button 
              onClick={onClose} 
              variant="outline"
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NodeSelectionModal;
