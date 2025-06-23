
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Mail, MessageSquare, Database, Webhook, Zap, Clock, MousePointer, GitBranch } from 'lucide-react';

interface ExistingNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNode: (nodeId: string) => void;
  nodes: any[];
}

const ExistingNodeModal: React.FC<ExistingNodeModalProps> = ({
  isOpen,
  onClose,
  onSelectNode,
  nodes,
}) => {
  const getIcon = (type: string, category?: string) => {
    if (type === 'trigger') {
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
    } else if (type === 'action') {
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
    } else if (type === 'router') {
      return <GitBranch className="h-4 w-4" />;
    }
    return <Play className="h-4 w-4" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-blue-200 max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-blue-900">Select Existing Node</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          {nodes.map((node) => (
            <Card 
              key={node.id} 
              className="p-3 cursor-pointer hover:bg-blue-50 border-blue-200 transition-colors"
              onClick={() => onSelectNode(node.id)}
            >
              <div className="flex items-center space-x-3">
                <div className="text-blue-600">
                  {getIcon(node.type, node.data?.category)}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-blue-900 text-sm">
                    {node.data?.label || node.type}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                      {node.type}
                    </Badge>
                    {node.data?.category && (
                      <Badge className="text-xs bg-blue-50 text-blue-600 border-blue-100">
                        {node.data.category}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-end mt-6">
          <Button onClick={onClose} variant="outline" className="border-blue-200 text-blue-600">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExistingNodeModal;
