export type AlertLevel = 'none' | 'warning' | 'critical';

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  color: string;
  is_default: boolean;
  is_active: boolean;
  updated_at: string | null;
}

export interface CategoryExpense {
  category_id: string;
  name: string;
  spent: number;
  budget: number;
  percentage: number;
  color_class: string;
  alert_level: AlertLevel;
}

export interface CategoryBudget {
  id: string;
  category_name: string;
  budget_limit: number;
  alert_threshold: number;
}