/**
 * TypeScript interfaces for Run Computation scenarios
 */

export interface InputData {
  id: string | number;
  name: string;
  unitType: string;
  constraints: string;
  lowerBound: number;
  upperBound: number;
}

export interface ResultData {
  id: string | number;
  name: string;
  unitType: string;
  constraints: string;
  lowerBound: number;
  upperBound: number;
}

export interface Scenario {
  id: string;
  userId: string;
  name: string;
  analysisType: string;
  description?: string;
  createdDate: string;
  status: 'Draft' | 'Running' | 'Completed';
  inputs: InputData[];
  results: {
    table: ResultData[];
    lineChart: any[];
    barChart: any[];
  };
}

export interface CreateScenarioDTO {
  name: string;
  analysisType: string;
  description?: string;
}

export interface UpdateScenarioDTO {
  name?: string;
  analysisType?: string;
  description?: string;
  status?: 'Draft' | 'Running' | 'Completed';
  inputs?: InputData[];
  results?: {
    table?: ResultData[];
    lineChart?: any[];
    barChart?: any[];
  };
}
