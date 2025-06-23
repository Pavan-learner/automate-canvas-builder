
import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Play, Mail, MessageSquare, Database, Webhook } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ActionNode = memo(({ data, sourcePosition, targetPosition }: NodeProps) => {
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

  return (
    <Card className="min-w-[200px] bg-blue-100 border-2 border-blue-300 shadow-md hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 text-blue-700">
            {getIcon(data.category)}
            <span className="font-medium text-sm">ACTION</span>
          </div>
          <Badge className="text-xs bg-blue-200 text-blue-700 border-blue-300">
            {data.category}
          </Badge>
        </div>
        
        <div className="text-gray-900 font-medium text-sm mb-1">
          {data.label}
        </div>
        
        {data.description && (
          <div className="text-gray-600 text-xs">
            {data.description}
          </div>
        )}
      </div>
      
      <Handle
        type="target"
        position={targetPosition || Position.Left}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
      <Handle
        type="source"
        position={sourcePosition || Position.Right}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
    </Card>
  );
});

ActionNode.displayName = 'ActionNode';

export default ActionNode;
