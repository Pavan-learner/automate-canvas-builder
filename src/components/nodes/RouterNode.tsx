
import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { GitBranch, Edit3, Shuffle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface RouterNodeData {
  label?: string;
  routeType?: string;
  enabled?: boolean;
}

const RouterNode = memo(({ data, sourcePosition, targetPosition, id }: NodeProps) => {
  const nodeData = (data as RouterNodeData) || {};
  const label = nodeData.label || 'Load Balancer';
  const routeType = nodeData.routeType || 'conditional';
  const enabled = nodeData.enabled !== false;

  const handleEdit = () => {
    window.dispatchEvent(new CustomEvent('editNode', { detail: { id, data: nodeData, type: 'router' } }));
  };

  const handleToggle = () => {
    window.dispatchEvent(new CustomEvent('toggleNode', { detail: { id, enabled: !enabled } }));
  };

  return (
    <div className="relative">
      <Card className={`min-w-[220px] ${enabled ? 'bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-300' : 'bg-gray-100 border-2 border-gray-300 opacity-60'} shadow-lg hover:shadow-xl transition-all duration-200`}>
        <div className="p-4">
          {/* Header with icon and controls */}
          <div className="flex items-center justify-between mb-3">
            <div className={`flex items-center space-x-2 ${enabled ? 'text-orange-800' : 'text-gray-500'}`}>
              <div className="relative">
                <GitBranch className="h-5 w-5" />
                <Shuffle className="h-3 w-3 absolute -top-1 -right-1" />
              </div>
              <span className="font-bold text-sm tracking-wide">LOAD BALANCER</span>
            </div>
            <div className="flex items-center space-x-1">
              <Badge className={`text-xs ${enabled ? 'bg-orange-200 text-orange-800 border-orange-300' : 'bg-gray-200 text-gray-600'}`}>
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
          
          {/* Load Balancer Visual */}
          <div className="mb-3">
            <div className={`text-center ${enabled ? 'text-gray-900' : 'text-gray-500'} font-semibold text-sm mb-2`}>
              {label}
            </div>
            
            {/* Visual representation of load balancing */}
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className={`w-2 h-6 ${enabled ? 'bg-orange-400' : 'bg-gray-400'} rounded-full`}></div>
              <div className={`w-4 h-8 ${enabled ? 'bg-orange-500' : 'bg-gray-500'} rounded-lg flex items-center justify-center`}>
                <div className={`w-1 h-4 ${enabled ? 'bg-orange-200' : 'bg-gray-200'} rounded-full`}></div>
              </div>
              <div className={`w-2 h-6 ${enabled ? 'bg-orange-400' : 'bg-gray-400'} rounded-full`}></div>
            </div>
            
            <div className="flex justify-center">
              <Button
                size="sm"
                variant={enabled ? "destructive" : "default"}
                className="text-xs px-3 py-1"
                onClick={handleToggle}
              >
                {enabled ? 'Disable' : 'Enable'}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Connection handles */}
        <Handle
          type="target"
          position={Position.Left}
          className={`w-3 h-3 ${enabled ? 'bg-orange-600' : 'bg-gray-400'} border-2 border-white -translate-x-1`}
        />
        <Handle
          type="source"
          position={Position.Top}
          id="output-1"
          className={`w-3 h-3 ${enabled ? 'bg-orange-600' : 'bg-gray-400'} border-2 border-white -translate-y-1`}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="output-2"
          className={`w-3 h-3 ${enabled ? 'bg-orange-600' : 'bg-gray-400'} border-2 border-white translate-y-1`}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="output-3"
          className={`w-3 h-3 ${enabled ? 'bg-orange-600' : 'bg-gray-400'} border-2 border-white translate-x-1`}
        />
      </Card>
    </div>
  );
});

RouterNode.displayName = 'RouterNode';

export default RouterNode;
