export interface UserMemory {
  userId: string;
  preferredBrands: string[];
  maxBudgetObserved?: number;
  prioritizesMobility: boolean;
  prioritizesBattery: boolean;
  workloads: string[];
  lastUpdated: string;
}
