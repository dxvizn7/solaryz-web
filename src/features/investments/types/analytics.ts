export type PortfolioSeriesPoint = {
  month: string;
  total: number;
};

export type AllocationPoint = {
  type: string;
  amount: number;
  percentage: number;
};

export type BenchmarkPoint = {
  month: string;
  performance_pct: number;
};

export type DividendsMonthlyPoint = {
  month: string;
  total: number;
};

export type DividendsByAssetPoint = {
  asset: string;
  total: number;
};

export type PerformanceResponse = {
  series: PortfolioSeriesPoint[];
  allocation: AllocationPoint[];
  benchmark: BenchmarkPoint[];
};

export type DividendsResponse = {
  monthly: DividendsMonthlyPoint[];
  by_asset: DividendsByAssetPoint[];
};
