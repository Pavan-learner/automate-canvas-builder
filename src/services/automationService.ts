
export interface AutomationData {
  id: string;
  name: string;
  nodes: any[];
  edges: any[];
  metadata: {
    layout: 'horizontal' | 'vertical';
    created_at: string;
    updated_at: string;
  };
  changes: {
    added_nodes: string[];
    deleted_nodes: string[];
    added_edges: string[];
    deleted_edges: string[];
    insertions: any[];
  };
}

class AutomationService {
  private readonly STORAGE_KEY = 'automation_flows';

  getAllAutomations(): AutomationData[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading automations:', error);
      return [];
    }
  }

  saveAutomation(automation: AutomationData): void {
    try {
      const automations = this.getAllAutomations();
      const existingIndex = automations.findIndex(a => a.id === automation.id);
      
      if (existingIndex >= 0) {
        automations[existingIndex] = {
          ...automation,
          metadata: {
            ...automation.metadata,
            updated_at: new Date().toISOString(),
          },
        };
      } else {
        automations.push({
          ...automation,
          metadata: {
            ...automation.metadata,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        });
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(automations));
    } catch (error) {
      console.error('Error saving automation:', error);
    }
  }

  getAutomation(id: string): AutomationData | null {
    const automations = this.getAllAutomations();
    return automations.find(a => a.id === id) || null;
  }

  deleteAutomation(id: string): void {
    try {
      const automations = this.getAllAutomations();
      const filtered = automations.filter(a => a.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting automation:', error);
    }
  }

  generateId(): string {
    return `automation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const automationService = new AutomationService();
