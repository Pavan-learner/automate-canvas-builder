
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EditNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (nodeData: any) => void;
  nodeData: any;
  nodeType: 'trigger' | 'action' | 'router';
}

const EditNodeModal = ({ isOpen, onClose, onSave, nodeData, nodeType }: EditNodeModalProps) => {
  const [formData, setFormData] = useState({
    label: '',
    category: '',
    description: '',
    routeType: '',
  });

  useEffect(() => {
    if (nodeData) {
      setFormData({
        label: nodeData.label || '',
        category: nodeData.category || '',
        description: nodeData.description || '',
        routeType: nodeData.routeType || '',
      });
    }
  }, [nodeData]);

  const handleSave = () => {
    const updatedData = { ...nodeData, ...formData };
    onSave(updatedData);
    onClose();
  };

  const getCategoryOptions = () => {
    switch (nodeType) {
      case 'trigger':
        return ['email', 'time', 'event'];
      case 'action':
        return ['email', 'sms', 'database', 'webhook'];
      case 'router':
        return ['conditional', 'parallel', 'random'];
      default:
        return [];
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl text-gray-900">
            Edit {nodeType} Node
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="label" className="text-sm font-medium text-gray-700">
              Label
            </Label>
            <Input
              id="label"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              className="mt-1 border-blue-200 focus:border-blue-400"
            />
          </div>

          <div>
            <Label htmlFor="category" className="text-sm font-medium text-gray-700">
              {nodeType === 'router' ? 'Route Type' : 'Category'}
            </Label>
            <Select
              value={nodeType === 'router' ? formData.routeType : formData.category}
              onValueChange={(value) => {
                if (nodeType === 'router') {
                  setFormData({ ...formData, routeType: value });
                } else {
                  setFormData({ ...formData, category: value });
                }
              }}
            >
              <SelectTrigger className="mt-1 border-blue-200 focus:border-blue-400">
                <SelectValue placeholder={`Select ${nodeType === 'router' ? 'route type' : 'category'}`} />
              </SelectTrigger>
              <SelectContent>
                {getCategoryOptions().map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 border-blue-200 focus:border-blue-400"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditNodeModal;
