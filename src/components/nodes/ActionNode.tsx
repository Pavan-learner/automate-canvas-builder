
import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Play, Mail, MessageSquare, Database, Webhook, Edit3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ActionNodeData {
  label?: string;
  category?: string;
  description?: string;
  enabled?: boolean;
}

const ActionNode = memo(({ data, sourcePosition, targetPosition, id }: NodeProps) => {
  const nodeData = (data as ActionNodeData) || {};
  const category = nodeData.category || 'default';
  const label = nodeData.label || 'Action';
  const description = nodeData.description || '';
  const enabled = nodeData.enabled !== false;

  const getIcon = (category: string) => {
    switch (category) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4" />;
      case 'database':
        return <Database className="h-4 w-4" />;
      case 'webhook':
        return <Webhook className="h-4 w-4" />;
      default:
        return <Play className="h-4 w-4" />;
    }
  };

  const handleEdit = () => {
    window.dispatchEvent(new CustomEvent('editNode', { detail: { id, data: nodeData, type: 'action' } }));
  };

  const handleToggle = () => {
    window.dispatchEvent(new CustomEvent('toggleNode', { detail: { id, enabled: !enabled } }));
  };

  return (
    <Card className={`min-w-[200px] ${enabled ? 'bg-blue-100 border-2 border-blue-300' : 'bg-gray-100 border-2 border-gray-300 opacity-60'} shadow-md hover:shadow-lg transition-shadow`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className={`flex items-center space-x-2 ${enabled ? 'text-blue-700' : 'text-gray-500'}`}>
            {getIcon(category)}
            <span className="font-medium text-sm">ACTION</span>
          </div>
          <div className="flex items-center space-x-1">
            <Badge className={`text-xs ${enabled ? 'bg-blue-200 text-blue-700 border-blue-300' : 'bg-gray-200 text-gray-600'}`}>
              {category}
            </Badge>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-6 w-6 p-0" 
              onClick={handleEdit}
            >
              <Edit3 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className={`${enabled ? 'text-gray-900' : 'text-gray-500'} font-medium text-sm mb-1`}>
          {label}
        </div>
        
        {description && (
          <div className={`${enabled ? 'text-gray-600' : 'text-gray-400'} text-xs mb-2`}>
            {description}
          </div>
        )}

        <div className="flex justify-between items-center">
          <Button
            size="sm"
            variant={enabled ? "destructive" : "default"}
            className="text-xs px-2 py-1"
            onClick={handleToggle}
          >
            {enabled ? 'Disable' : 'Enable'}
          </Button>
        </div>
      </div>
      
      <Handle
        type="target"
        position={targetPosition || Position.Left}
        className={`w-3 h-3 ${enabled ? 'bg-blue-500' : 'bg-gray-400'} border-2 border-white`}
      />
      <Handle
        type="source"
        position={sourcePosition || Position.Right}
        className={`w-3 h-3 ${enabled ? 'bg-blue-500' : 'bg-gray-400'} border-2 border-white`}
      />
    </Card>
  );
});

ActionNode.displayName = 'ActionNode';

export default ActionNode;
