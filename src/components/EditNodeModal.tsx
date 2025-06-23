
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
    // Sub-options for different categories
    emailHost: '',
    emailPort: '',
    emailUsername: '',
    emailPassword: '',
    smsApiKey: '',
    smsProvider: '',
    webhookUrl: '',
    webhookMethod: 'POST',
    databaseHost: '',
    databaseName: '',
    databaseTable: '',
    timeInterval: '',
    timeUnit: 'minutes',
  });

  useEffect(() => {
    if (nodeData) {
      setFormData({
        label: nodeData.label || '',
        category: nodeData.category || '',
        description: nodeData.description || '',
        routeType: nodeData.routeType || '',
        emailHost: nodeData.emailHost || '',
        emailPort: nodeData.emailPort || '',
        emailUsername: nodeData.emailUsername || '',
        emailPassword: nodeData.emailPassword || '',
        smsApiKey: nodeData.smsApiKey || '',
        smsProvider: nodeData.smsProvider || '',
        webhookUrl: nodeData.webhookUrl || '',
        webhookMethod: nodeData.webhookMethod || 'POST',
        databaseHost: nodeData.databaseHost || '',
        databaseName: nodeData.databaseName || '',
        databaseTable: nodeData.databaseTable || '',
        timeInterval: nodeData.timeInterval || '',
        timeUnit: nodeData.timeUnit || 'minutes',
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

  const renderCategorySpecificFields = () => {
    const category = nodeType === 'router' ? formData.routeType : formData.category;
    
    switch (category) {
      case 'email':
        return (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="emailHost" className="text-sm font-medium text-gray-700">
                  Email Host
                </Label>
                <Input
                  id="emailHost"
                  value={formData.emailHost}
                  onChange={(e) => setFormData({ ...formData, emailHost: e.target.value })}
                  placeholder="smtp.gmail.com"
                  className="mt-1 border-blue-200"
                />
              </div>
              <div>
                <Label htmlFor="emailPort" className="text-sm font-medium text-gray-700">
                  Port
                </Label>
                <Input
                  id="emailPort"
                  value={formData.emailPort}
                  onChange={(e) => setFormData({ ...formData, emailPort: e.target.value })}
                  placeholder="587"
                  className="mt-1 border-blue-200"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="emailUsername" className="text-sm font-medium text-gray-700">
                Username/Email
              </Label>
              <Input
                id="emailUsername"
                value={formData.emailUsername}
                onChange={(e) => setFormData({ ...formData, emailUsername: e.target.value })}
                placeholder="your-email@example.com"
                className="mt-1 border-blue-200"
              />
            </div>
            <div>
              <Label htmlFor="emailPassword" className="text-sm font-medium text-gray-700">
                Password/App Password
              </Label>
              <Input
                id="emailPassword"
                type="password"
                value={formData.emailPassword}
                onChange={(e) => setFormData({ ...formData, emailPassword: e.target.value })}
                placeholder="Enter password"
                className="mt-1 border-blue-200"
              />
            </div>
          </>
        );
      
      case 'sms':
        return (
          <>
            <div>
              <Label htmlFor="smsProvider" className="text-sm font-medium text-gray-700">
                SMS Provider
              </Label>
              <Select
                value={formData.smsProvider}
                onValueChange={(value) => setFormData({ ...formData, smsProvider: value })}
              >
                <SelectTrigger className="mt-1 border-blue-200">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twilio">Twilio</SelectItem>
                  <SelectItem value="aws-sns">AWS SNS</SelectItem>
                  <SelectItem value="nexmo">Nexmo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="smsApiKey" className="text-sm font-medium text-gray-700">
                API Key
              </Label>
              <Input
                id="smsApiKey"
                value={formData.smsApiKey}
                onChange={(e) => setFormData({ ...formData, smsApiKey: e.target.value })}
                placeholder="Enter API key"
                className="mt-1 border-blue-200"
              />
            </div>
          </>
        );
      
      case 'webhook':
        return (
          <>
            <div>
              <Label htmlFor="webhookUrl" className="text-sm font-medium text-gray-700">
                Webhook URL
              </Label>
              <Input
                id="webhookUrl"
                value={formData.webhookUrl}
                onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
                placeholder="https://api.example.com/webhook"
                className="mt-1 border-blue-200"
              />
            </div>
            <div>
              <Label htmlFor="webhookMethod" className="text-sm font-medium text-gray-700">
                HTTP Method
              </Label>
              <Select
                value={formData.webhookMethod}
                onValueChange={(value) => setFormData({ ...formData, webhookMethod: value })}
              >
                <SelectTrigger className="mt-1 border-blue-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      
      case 'database':
        return (
          <>
            <div>
              <Label htmlFor="databaseHost" className="text-sm font-medium text-gray-700">
                Database Host
              </Label>
              <Input
                id="databaseHost"
                value={formData.databaseHost}
                onChange={(e) => setFormData({ ...formData, databaseHost: e.target.value })}
                placeholder="localhost:5432"
                className="mt-1 border-blue-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="databaseName" className="text-sm font-medium text-gray-700">
                  Database Name
                </Label>
                <Input
                  id="databaseName"
                  value={formData.databaseName}
                  onChange={(e) => setFormData({ ...formData, databaseName: e.target.value })}
                  placeholder="myapp_db"
                  className="mt-1 border-blue-200"
                />
              </div>
              <div>
                <Label htmlFor="databaseTable" className="text-sm font-medium text-gray-700">
                  Table Name
                </Label>
                <Input
                  id="databaseTable"
                  value={formData.databaseTable}
                  onChange={(e) => setFormData({ ...formData, databaseTable: e.target.value })}
                  placeholder="users"
                  className="mt-1 border-blue-200"
                />
              </div>
            </div>
          </>
        );
      
      case 'time':
        return (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="timeInterval" className="text-sm font-medium text-gray-700">
                  Interval
                </Label>
                <Input
                  id="timeInterval"
                  type="number"
                  value={formData.timeInterval}
                  onChange={(e) => setFormData({ ...formData, timeInterval: e.target.value })}
                  placeholder="5"
                  className="mt-1 border-blue-200"
                />
              </div>
              <div>
                <Label htmlFor="timeUnit" className="text-sm font-medium text-gray-700">
                  Unit
                </Label>
                <Select
                  value={formData.timeUnit}
                  onValueChange={(value) => setFormData({ ...formData, timeUnit: value })}
                >
                  <SelectTrigger className="mt-1 border-blue-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white max-h-[90vh] overflow-y-auto">
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

          {renderCategorySpecificFields()}

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
