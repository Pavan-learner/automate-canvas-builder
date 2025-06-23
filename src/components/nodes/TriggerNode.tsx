
import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Zap, Mail, Clock, MousePointer } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const TriggerNode = memo(({ data, sourcePosition }: NodeProps) => {
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

  return (
    <Card className="min-w-[200px] bg-white border-2 border-blue-300 shadow-md hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 text-blue-700">
            {getIcon(data.category)}
            <span className="font-medium text-sm">TRIGGER</span>
          </div>
          <Badge className={`text-xs ${getCategoryColor(data.category)}`}>
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
        type="source"
        position={sourcePosition || Position.Right}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
    </Card>
  );
});

TriggerNode.displayName = 'TriggerNode';

export default TriggerNode;
