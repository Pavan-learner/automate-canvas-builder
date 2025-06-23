
import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { GitBranch, Edit3, Network, Shuffle, Route } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface RouterNodeData {
  label?: string;
  routeType?: string;
  enabled?: boolean;
}

const RouterNode = memo(({ data, sourcePosition, targetPosition, id }: NodeProps) => {
  const nodeData = data as RouterNodeData;
  if (!nodeData) return null;

  const label = nodeData.label || 'Load Balancer';
  const routeType = nodeData.routeType || 'round-robin';
  const enabled = nodeData.enabled !== false;

  const handleEdit = () => {
    window.dispatchEvent(new CustomEvent('editNode', { detail: { id, data: nodeData, type: 'router' } }));
  };

  const handleToggle = (checked: boolean) => {
    window.dispatchEvent(new CustomEvent('toggleNode', { detail: { id, enabled: checked } }));
  };

  return (
    <div className="relative">
      <Card className={`min-w-[240px] ${enabled ? 'bg-white border-2 border-blue-300 shadow-md' : 'bg-gray-50 border-2 border-gray-300 opacity-70 shadow-sm'} hover:shadow-lg transition-all duration-200`}>
        <div className="p-4">
          {/* Header with load balancer icon and controls */}
          <div className="flex items-center justify-between mb-3">
            <div className={`flex items-center space-x-2 ${enabled ? 'text-blue-700' : 'text-gray-500'}`}>
              <div className="relative flex items-center">
                <Network className="h-5 w-5" />
                <Route className="h-3 w-3 absolute -top-1 -right-1" />
              </div>
              <span className="font-bold text-sm tracking-wide">LOAD BALANCER</span>
            </div>
            <div className="flex items-center space-x-1">
              <Badge className={`text-xs ${enabled ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                {routeType}
              </Badge>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-6 w-6 p-0 hover:bg-blue-100" 
                onClick={handleEdit}
              >
                <Edit3 className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          {/* Load Balancer Visual Representation */}
          <div className="mb-4">
            <div className={`text-center ${enabled ? 'text-gray-900' : 'text-gray-500'} font-semibold text-sm mb-3`}>
              {label}
            </div>
            
            {/* Enhanced Load Balancer Visual */}
            <div className="flex flex-col items-center space-y-2">
              {/* Input connection */}
              <div className={`w-6 h-2 ${enabled ? 'bg-blue-400' : 'bg-gray-400'} rounded-full`}></div>
              
              {/* Load balancer core */}
              <div className={`relative w-16 h-10 ${enabled ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gray-500'} rounded-lg flex items-center justify-center shadow-md`}>
                <div className="flex space-x-1">
                  <div className={`w-1 h-4 ${enabled ? 'bg-blue-200' : 'bg-gray-200'} rounded-full animate-pulse`}></div>
                  <div className={`w-1 h-4 ${enabled ? 'bg-blue-100' : 'bg-gray-200'} rounded-full animate-pulse`} style={{animationDelay: '0.2s'}}></div>
                  <div className={`w-1 h-4 ${enabled ? 'bg-blue-200' : 'bg-gray-200'} rounded-full animate-pulse`} style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
              
              {/* Output connections arranged in a fan pattern */}
              <div className="flex justify-center space-x-2 mt-2">
                <div className={`w-3 h-4 ${enabled ? 'bg-blue-400' : 'bg-gray-400'} rounded-full transform -rotate-12`}></div>
                <div className={`w-3 h-4 ${enabled ? 'bg-blue-400' : 'bg-gray-400'} rounded-full`}></div>
                <div className={`w-3 h-4 ${enabled ? 'bg-blue-400' : 'bg-gray-400'} rounded-full transform rotate-12`}></div>
              </div>
            </div>
            
            <div className="flex items-center justify-center mt-4">
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
        </div>
        
        {/* Connection handles positioned for load balancer pattern */}
        <Handle
          type="target"
          position={Position.Left}
          className={`w-3 h-3 ${enabled ? 'bg-blue-600 border-2 border-white' : 'bg-gray-400 border-2 border-white'} -translate-x-1`}
        />
        
        {/* Multiple output handles for load balancing */}
        <Handle
          type="source"
          position={Position.Top}
          id="output-1"
          className={`w-3 h-3 ${enabled ? 'bg-blue-600 border-2 border-white' : 'bg-gray-400 border-2 border-white'} -translate-y-1`}
          style={{ left: '30%' }}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="output-2"
          className={`w-3 h-3 ${enabled ? 'bg-blue-600 border-2 border-white' : 'bg-gray-400 border-2 border-white'} translate-x-1`}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="output-3"
          className={`w-3 h-3 ${enabled ? 'bg-blue-600 border-2 border-white' : 'bg-gray-400 border-2 border-white'} translate-y-1`}
          style={{ left: '70%' }}
        />
      </Card>
    </div>
  );
});

RouterNode.displayName = 'RouterNode';

export default RouterNode;
