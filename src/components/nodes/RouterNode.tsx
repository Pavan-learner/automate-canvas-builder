
import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Network, Edit3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface RouterNodeData {
  label?: string;
  routeType?: string;
  enabled?: boolean;
}

const RouterNode = memo(({ data, sourcePosition, targetPosition, id }: NodeProps<RouterNodeData>) => {
  const nodeData = data || {};
  const label = typeof nodeData.label === 'string' ? nodeData.label : 'Load Balancer';
  const routeType = typeof nodeData.routeType === 'string' ? nodeData.routeType : 'conditional';
  const enabled = nodeData.enabled !== false;

  const handleEdit = () => {
    window.dispatchEvent(new CustomEvent('editNode', { detail: { id, data: nodeData, type: 'router' } }));
  };

  const handleToggle = () => {
    window.dispatchEvent(new CustomEvent('toggleNode', { detail: { id, enabled: !enabled } }));
  };

  return (
    <div className="relative">
      {/* Load balancer style design */}
      <Card className={`min-w-[200px] ${enabled ? 'bg-gradient-to-br from-purple-100 to-purple-200 border-2 border-purple-400' : 'bg-gray-100 border-2 border-gray-300 opacity-60'} shadow-md hover:shadow-lg transition-shadow`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className={`flex items-center space-x-2 ${enabled ? 'text-purple-800' : 'text-gray-500'}`}>
              <Network className="h-5 w-5" />
              <span className="font-medium text-sm">ROUTER</span>
            </div>
            <div className="flex items-center space-x-1">
              <Badge className={`text-xs ${enabled ? 'bg-purple-300 text-purple-800 border-purple-400' : 'bg-gray-200 text-gray-600'}`}>
                {routeType}
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
          
          <div className="text-center">
            <div className={`${enabled ? 'text-gray-900' : 'text-gray-500'} font-medium text-sm mb-2`}>
              {label}
            </div>
            
            <div className="flex justify-center">
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
        </div>
        
        <Handle
          type="target"
          position={Position.Left}
          className={`w-3 h-3 ${enabled ? 'bg-purple-600' : 'bg-gray-400'} border-2 border-white -translate-x-1`}
        />
        <Handle
          type="source"
          position={Position.Top}
          id="output-1"
          className={`w-3 h-3 ${enabled ? 'bg-purple-600' : 'bg-gray-400'} border-2 border-white -translate-y-1`}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="output-2"
          className={`w-3 h-3 ${enabled ? 'bg-purple-600' : 'bg-gray-400'} border-2 border-white translate-y-1`}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="output-3"
          className={`w-3 h-3 ${enabled ? 'bg-purple-600' : 'bg-gray-400'} border-2 border-white translate-x-1`}
        />
      </Card>
    </div>
  );
});

RouterNode.displayName = 'RouterNode';

export default RouterNode;
