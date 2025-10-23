import {
  Scenario,
  CreateScenarioDTO,
  UpdateScenarioDTO,
} from '../types/scenario.types';

const STORAGE_KEY = 'scenarios';

/**
 * Mock API service for managing user-specific scenarios
 * Uses localStorage for persistence
 */

/**
 * Get all scenarios from localStorage
 */
const getAllScenarios = (): Scenario[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

/**
 * Save scenarios to localStorage
 */
const saveAllScenarios = (scenarios: Scenario[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
};

/**
 * Generate a unique ID for new scenarios
 */
const generateId = (): string => {
  return `scenario-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get current date in MM/DD/YYYY format
 */
const getCurrentDate = (): string => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const year = now.getFullYear();
  return `${month}/${day}/${year}`;
};

/**
 * Load sample data from dummy-data files and convert to Scenario format
 */
const loadSampleScenarios = async (userId: string): Promise<Scenario[]> => {
  try {
    // Load all dummy data files
    const [
      listData,
      inputsData,
      resultsTableData,
      resultsLineData,
      resultsBarData,
    ] = await Promise.all([
      fetch('/dummy-data/list.json').then((res) => res.json()),
      fetch('/dummy-data/inputs.json').then((res) => res.json()),
      fetch('/dummy-data/results_table.json').then((res) => res.json()),
      fetch('/dummy-data/results_line_chart.json').then((res) => res.json()),
      fetch('/dummy-data/results_bar_chart.json').then((res) => res.json()),
    ]);

    // Convert list data to full Scenario objects
    const scenarios: Scenario[] = listData.map((item: any) => ({
      id: `sample-${item.id}`,
      userId: userId,
      name: item.name,
      analysisType: item.analysisType,
      description: `Sample scenario for ${item.analysisType}`,
      createdDate: item.createdDate,
      status: item.status,
      inputs: inputsData || [],
      results: {
        table: resultsTableData || [],
        lineChart: resultsLineData || [],
        barChart: resultsBarData || [],
      },
    }));

    return scenarios;
  } catch (error) {
    // Error loading sample scenarios - return empty array
    return [];
  }
};

/**
 * Initialize scenarios for a new user
 * Copies sample data and associates it with the user
 */
export const initializeUserScenarios = async (
  userId: string
): Promise<void> => {
  const allScenarios = getAllScenarios();
  const userScenarios = allScenarios.filter((s) => s.userId === userId);

  // Only initialize if user has no scenarios
  if (userScenarios.length === 0) {
    const sampleScenarios = await loadSampleScenarios(userId);
    const updatedScenarios = [...allScenarios, ...sampleScenarios];
    saveAllScenarios(updatedScenarios);
  }
};

/**
 * Get all scenarios for a specific user
 */
export const getUserScenarios = (userId: string): Scenario[] => {
  const allScenarios = getAllScenarios();
  return allScenarios.filter((scenario) => scenario.userId === userId);
};

/**
 * Get a specific scenario by ID
 */
export const getScenarioById = (scenarioId: string): Scenario | null => {
  const allScenarios = getAllScenarios();
  return allScenarios.find((scenario) => scenario.id === scenarioId) || null;
};

/**
 * Create a new scenario
 */
export const createScenario = (
  userId: string,
  data: CreateScenarioDTO
): Scenario => {
  const newScenario: Scenario = {
    id: generateId(),
    userId: userId,
    name: data.name,
    analysisType: data.analysisType,
    description: data.description,
    createdDate: getCurrentDate(),
    status: 'Draft',
    inputs: [],
    results: {
      table: [],
      lineChart: [],
      barChart: [],
    },
  };

  const allScenarios = getAllScenarios();
  allScenarios.push(newScenario);
  saveAllScenarios(allScenarios);

  return newScenario;
};

/**
 * Update an existing scenario
 */
export const updateScenario = (
  scenarioId: string,
  updates: UpdateScenarioDTO
): Scenario | null => {
  const allScenarios = getAllScenarios();
  const index = allScenarios.findIndex((s) => s.id === scenarioId);

  if (index === -1) {
    return null;
  }

  const scenario = allScenarios[index];

  // Update scenario fields
  if (updates.name !== undefined) scenario.name = updates.name;
  if (updates.analysisType !== undefined)
    scenario.analysisType = updates.analysisType;
  if (updates.description !== undefined)
    scenario.description = updates.description;
  if (updates.status !== undefined) scenario.status = updates.status;
  if (updates.inputs !== undefined) scenario.inputs = updates.inputs;
  if (updates.results !== undefined) {
    if (updates.results.table !== undefined)
      scenario.results.table = updates.results.table;
    if (updates.results.lineChart !== undefined)
      scenario.results.lineChart = updates.results.lineChart;
    if (updates.results.barChart !== undefined)
      scenario.results.barChart = updates.results.barChart;
  }

  allScenarios[index] = scenario;
  saveAllScenarios(allScenarios);

  return scenario;
};

/**
 * Delete a scenario
 */
export const deleteScenario = (scenarioId: string): boolean => {
  const allScenarios = getAllScenarios();
  const filteredScenarios = allScenarios.filter((s) => s.id !== scenarioId);

  if (filteredScenarios.length === allScenarios.length) {
    return false; // Scenario not found
  }

  saveAllScenarios(filteredScenarios);
  return true;
};

/**
 * Duplicate a scenario
 */
export const duplicateScenario = (scenarioId: string): Scenario | null => {
  const scenario = getScenarioById(scenarioId);

  if (!scenario) {
    return null;
  }

  const newScenario: Scenario = {
    ...scenario,
    id: generateId(),
    name: `${scenario.name} (Copy)`,
    createdDate: getCurrentDate(),
    status: 'Draft',
  };

  const allScenarios = getAllScenarios();
  allScenarios.push(newScenario);
  saveAllScenarios(allScenarios);

  return newScenario;
};
