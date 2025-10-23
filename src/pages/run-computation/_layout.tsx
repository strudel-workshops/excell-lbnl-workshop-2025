import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box } from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { RunComputationProvider } from './-context/ContextProvider';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import {
  getUserScenarios,
  deleteScenario,
  duplicateScenario,
} from '../../services/scenarioService';
import { Scenario } from '../../types/scenario.types';

export const Route = createFileRoute('/run-computation/_layout')({
  component: RunComputationLayout,
});

/**
 * Top-level wrapper for the run-computation Task Flow templates.
 * Inner pages are rendered inside the `<Outlet />` component
 */
function RunComputationLayout() {
  const { user } = useAuth();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);

  // Load user scenarios
  useEffect(() => {
    if (user) {
      const userScenarios = getUserScenarios(user.id);
      setScenarios(userScenarios);
    }
  }, [user]);

  // Handle duplicate scenario
  const handleDuplicate = (scenarioId: string) => {
    const duplicated = duplicateScenario(scenarioId);
    if (duplicated && user) {
      const updatedScenarios = getUserScenarios(user.id);
      setScenarios(updatedScenarios);
    }
  };

  // Handle delete scenario
  const handleDelete = (scenarioId: string) => {
    const success = deleteScenario(scenarioId);
    if (success && user) {
      const updatedScenarios = getUserScenarios(user.id);
      setScenarios(updatedScenarios);
    }
  };

  return (
    <Box>
      <Box>
        <RunComputationProvider
          list={{
            table: {
              data: scenarios,
              // CUSTOMIZE: index page data source unique ID field
              dataIdField: 'id',
              // CUSTOMIZE: index page columns
              columns: [
                {
                  field: 'name',
                  headerName: 'Scenario Name',
                  width: 200,
                },
                {
                  field: 'analysisType',
                  headerName: 'Analysis Type',
                  width: 200,
                },
                {
                  field: 'createdDate',
                  headerName: 'Date Created',
                  width: 200,
                },
                {
                  field: 'status',
                  headerName: 'Status',
                  width: 200,
                },
                {
                  field: 'actions',
                  headerName: 'Actions',
                  type: 'actions',
                  getActions: (params: any) => [
                    <GridActionsCellItem
                      icon={<ContentCopyIcon />}
                      label="Duplicate"
                      onClick={() => handleDuplicate(params.id)}
                    />,
                    <GridActionsCellItem icon={<EditIcon />} label="Edit" />,
                    <GridActionsCellItem
                      icon={<DeleteIcon />}
                      label="Delete"
                      onClick={() => handleDelete(params.id)}
                    />,
                  ],
                  flex: 1,
                },
              ],
            },
          }}
          inputs={{
            table: {
              data: [],
              // CUSTOMIZE: inputs table unique ID field
              dataIdField: 'id',
              // CUSTOMIZE: inputs table columns
              columns: [
                {
                  field: 'name',
                  headerName: 'Unit Name',
                  width: 200,
                },
                {
                  field: 'unitType',
                  headerName: 'Unit Type',
                  width: 200,
                },
                {
                  field: 'constraints',
                  headerName: 'Constraints',
                  width: 200,
                },
                {
                  field: 'lowerBound',
                  headerName: 'Lower Bound',
                  width: 200,
                  type: 'number',
                },
                {
                  field: 'upperBound',
                  headerName: 'Upper Bound',
                  width: 200,
                  type: 'number',
                },
              ],
            },
          }}
          results={{
            table: {
              data: [],
              // CUSTOMIZE: results table unique ID field
              dataIdField: 'id',
              // CUSTOMIZE: results table columns
              columns: [
                {
                  field: 'name',
                  headerName: 'Unit Name',
                  width: 200,
                },
                {
                  field: 'unitType',
                  headerName: 'Unit Type',
                  width: 200,
                },
                {
                  field: 'constraints',
                  headerName: 'Constraints',
                  width: 200,
                },
                {
                  field: 'lowerBound',
                  headerName: 'Lower Bound',
                  width: 200,
                  type: 'number',
                },
                {
                  field: 'upperBound',
                  headerName: 'Upper Bound',
                  width: 200,
                  type: 'number',
                },
              ],
            },
          }}
        >
          <Outlet />
        </RunComputationProvider>
      </Box>
    </Box>
  );
}
