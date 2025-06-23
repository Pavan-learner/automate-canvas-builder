
import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Zap, Mail, Clock, MousePointer, Edit3, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/car
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface TriggerNodeData {
  label?: string;
  category?: string;
  description?: string;
  enabled?: boolean;
}

const TriggerNode = memo(({ data, sourcePosition, id }: NodeProps) => {
  const nodeData = data as TriggerNodeData;
  if (!nodeData) return null;

  const category = nodeData.category || 'default';
  const label = nodeData.label || 'Trigger';
  const description = nodeData.description || '';
  const enabled = nodeData.enabled !== false;

  const getIcon = (category: string) => {
    switch (category) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'time':
        return <Clock className="h-4 w-4" />;
      case 'event':
        return <MousePointer className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    if (!enabled) return 'bg-gray-100 text-gray-500 border-gray-200';
    
    switch (category) {
      case 'email':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'time':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'event':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const handleEdit = () => {
    window.dispatchEvent(new CustomEvent('editNode', { detail: { id, data: nodeData, type: 'trigger' } }));
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
            {getIcon(category)}
            <span className="font-medium text-sm">TRIGGER</span>
          </div>
          <div className="flex items-center space-x-1">
            <Badge className={`text-xs ${getCategoryColor(category)}`}>
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
        type="source"
        position={sourcePosition || Position.Right}
        className={`w-3 h-3 ${enabled ? 'bg-blue-500 border-2 border-white' : 'bg-gray-400 border-2 border-white'}`}
      />
    </Card>
  );
});

TriggerNode.displayName = 'TriggerNode';

export default TriggerNode;
