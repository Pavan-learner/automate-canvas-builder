
import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { GitBranch, Edit3, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface RouterNodeData {
  label?: string;
  category?: string;
  description?: string;
  enabled?: boolean;
}

const RouterNode = memo(({ data, sourcePosition, targetPosition, id }: NodeProps) => {
  const nodeData = data as RouterNodeData;
  if (!nodeData) return null;

  const category = nodeData.category || 'condition';
  const label = nodeData.label || 'Router';
  const description = nodeData.description || '';
  const enabled = nodeData.enabled !== false;

  const handleEdit = () => {
    window.dispatchEvent(new CustomEvent('editNode', { detail: { id, data: nodeData, type: 'router' } }));
  };

  const handleToggle = (checked: boolean) => {
    window.dispatchEvent(new CustomEvent('toggleNode', { detail: { id, enabled: checked } }));
  };

  const handleDelete = () => {
    window.dispatchEvent(new CustomEvent('deleteNode', { detail: { id } }));
  };

  return (
    <Card className={`min-w-[200px] ${enabled ? 'bg-white border-2 border-blue-300 shadow-md' : 'bg-white border-2 border-gray-300 opacity-70 shadow-sm'} hover:shadow-lg transition-all duration-200`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className={`flex items-center space-x-2 ${enabled ? 'text-blue-700' : 'text-gray-500'}`}>
            <GitBranch className="h-4 w-4" />
            <span className="font-medium text-sm">ROUTER</span>
          </div>
          <div className="flex items-center space-x-1">
            <Badge className={`text-xs ${enabled ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
              {category}
            </Badge>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-6 w-6 p-0 hover:bg-blue-100" 
              onClick={handleEdit}
            >
              <Edit3 className="h-3 w-3" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-6 w-6 p-0 hover:bg-red-100 text-red-500" 
              onClick={handleDelete}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className={`${enabled ? 'text-gray-900' : 'text-gray-500'} font-medium text-sm mb-1`}>
          {label}
        </div>
        
        {description && (
          <div className={`${enabled ? 'text-gray-600' : 'text-gray-400'} text-xs mb-3`}>
            {description}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              checked={enabled}
              onCheckedChange={handleToggle}
              className="data-[state=checked]:bg-blue-600"
            />
            <span className={`text-xs ${enabled ? 'text-blue-700' : 'text-gray-500'}`}>
              {enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
      </div>
      
      <Handle
        type="target"
        position={targetPosition || Position.Left}
        className={`w-3 h-3 ${enabled ? 'bg-blue-500 border-2 border-white' : 'bg-gray-400 border-2 border-white'}`}
      />
      <Handle
        type="source"
        position={sourcePosition || Position.Right}
        className={`w-3 h-3 ${enabled ? 'bg-blue-500 border-2 border-white' : 'bg-gray-400 border-2 border-white'}`}
        id="true"
      />
      <Handle
        type="source"
        position={sourcePosition || Position.Right}
        className={`w-3 h-3 ${enabled ? 'bg-blue-500 border-2 border-white' : 'bg-gray-400 border-2 border-white'}`}
        id="false"
        style={{ top: '75%' }}
      />
    </Card>
  );
});

RouterNode.displayName = 'RouterNode';

export default RouterNode;
