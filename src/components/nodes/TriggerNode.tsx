
import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Zap, Mail, Clock, MousePointer, Edit3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface TriggerNodeData {
  label?: string;
  category?: string;
  description?: string;
  enabled?: boolean;
}

const TriggerNode = memo(({ data, sourcePosition, id }: NodeProps<TriggerNodeData>) => {
  const nodeData = data || {};
  const category = typeof nodeData.category === 'string' ? nodeData.category : 'default';
  const label = typeof nodeData.label === 'string' ? nodeData.label : 'Trigger';
  const description = typeof nodeData.description === 'string' ? nodeData.description : '';
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
    switch (category) {
      case 'email':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'time':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'event':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const handleEdit = () => {
    window.dispatchEvent(new CustomEvent('editNode', { detail: { id, data: nodeData, type: 'trigger' } }));
  };

  const handleToggle = () => {
    window.dispatchEvent(new CustomEvent('toggleNode', { detail: { id, enabled: !enabled } }));
  };

  return (
    <Card className={`min-w-[200px] ${enabled ? 'bg-white border-2 border-blue-300' : 'bg-gray-100 border-2 border-gray-300 opacity-60'} shadow-md hover:shadow-lg transition-shadow`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className={`flex items-center space-x-2 ${enabled ? 'text-blue-700' : 'text-gray-500'}`}>
            {getIcon(category)}
            <span className="font-medium text-sm">TRIGGER</span>
          </div>
          <div className="flex items-center space-x-1">
            <Badge className={`text-xs ${enabled ? getCategoryColor(category) : 'bg-gray-200 text-gray-600'}`}>
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
        type="source"
        position={sourcePosition || Position.Right}
        className={`w-3 h-3 ${enabled ? 'bg-blue-500' : 'bg-gray-400'} border-2 border-white`}
      />
    </Card>
  );
});

TriggerNode.displayName = 'TriggerNode';

export default TriggerNode;
