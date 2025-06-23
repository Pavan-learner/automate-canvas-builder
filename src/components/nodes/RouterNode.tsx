
import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { GitBranch } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RouterNodeData {
  label?: string;
  routeType?: string;
}

const RouterNode = memo(({ data, sourcePosition, targetPosition }: NodeProps<RouterNodeData>) => {
  const nodeData = data || {};
  const label = typeof nodeData.label === 'string' ? nodeData.label : 'Route Logic';
  const routeType = typeof nodeData.routeType === 'string' ? nodeData.routeType : 'conditional';

  return (
    <Card className="min-w-[180px] bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-400 shadow-md hover:shadow-lg transition-shadow transform rotate-45">
      <div className="p-4 transform -rotate-45">
        <div className="flex items-center justify-center mb-2">
          <div className="flex items-center space-x-2 text-blue-800">
            <GitBranch className="h-4 w-4" />
            <span className="font-medium text-sm">ROUTER</span>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-gray-900 font-medium text-sm mb-1">
            {label}
          </div>
          
          <Badge className="text-xs bg-blue-300 text-blue-800 border-blue-400">
            {routeType}
          </Badge>
        </div>
      </div>
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-600 border-2 border-white -translate-x-1"
      />
      <Handle
        type="source"
        position={Position.Top}
        id="output-1"
        className="w-3 h-3 bg-blue-600 border-2 border-white -translate-y-1"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="output-2"
        className="w-3 h-3 bg-blue-600 border-2 border-white translate-y-1"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="output-3"
        className="w-3 h-3 bg-blue-600 border-2 border-white translate-x-1"
      />
    </Card>
  );
});

RouterNode.displayName = 'RouterNode';

export default RouterNode;
