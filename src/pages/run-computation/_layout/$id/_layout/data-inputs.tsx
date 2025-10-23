import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useRunComputation } from '../../../-context/ContextProvider';
import { setInputsTableData } from '../../../-context/actions';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { AppLink } from '../../../../../components/AppLink';
import {
  getScenarioById,
  updateScenario,
} from '../../../../../services/scenarioService';
import { Scenario } from '../../../../../types/scenario.types';

export const Route = createFileRoute(
  '/run-computation/_layout/$id/_layout/data-inputs'
)({
  component: DataInputsPage,
});

/**
 * Page to display input data after creating or selecting an item from
 * the `<ComputationsList>` page in the run-computation Task Flow.
 * Table columns are configured in `definitions.inputs.table.columns`
 */
function DataInputsPage() {
  const { state, dispatch } = useRunComputation();
  const { id } = useParams({
    from: '/run-computation/_layout/$id/_layout/data-inputs',
  });
  const [scenario, setScenario] = useState<Scenario | null>(null);

  /**
   * Load scenario data when component mounts
   */
  useEffect(() => {
    const loadedScenario = getScenarioById(id);
    if (loadedScenario) {
      setScenario(loadedScenario);
      // Load inputs from scenario
      if (loadedScenario.inputs && loadedScenario.inputs.length > 0) {
        dispatch(setInputsTableData(loadedScenario.inputs));
      }
    }
  }, [id]);

  /**
   * Save inputs data back to scenario when it changes
   */
  useEffect(() => {
    if (
      scenario &&
      state.inputs.table.data &&
      state.inputs.table.data.length > 0
    ) {
      updateScenario(scenario.id, {
        inputs: state.inputs.table.data,
      });
    }
  }, [state.inputs.table.data]);

  return (
    <Stack spacing={0} flex={1}>
      <Box
        sx={{
          backgroundColor: 'white',
          padding: 2,
          borderBottom: '1px solid',
          borderColor: 'neutral.main',
        }}
      >
        <Stepper activeStep={0} sx={{ maxWidth: 850 }}>
          <Step key="Data Inputs">
            <StepLabel>
              <AppLink
                to="/run-computation/$id/data-inputs"
                params={{ id }}
                sx={{ color: 'inherit', textDecoration: 'none' }}
              >
                Data Inputs
              </AppLink>
            </StepLabel>
          </Step>
          <Step key="Optimization Settings">
            <StepLabel>
              <AppLink
                to="/run-computation/$id/settings"
                params={{ id }}
                sx={{ color: 'inherit', textDecoration: 'none' }}
              >
                Optimization Settings
              </AppLink>
            </StepLabel>
          </Step>
          <Step key="Results">
            <StepLabel>
              <AppLink
                to="/run-computation/$id/results"
                params={{ id }}
                sx={{ color: 'inherit', textDecoration: 'none' }}
              >
                Results
              </AppLink>
            </StepLabel>
          </Step>
        </Stepper>
      </Box>
      <Stack direction="row" spacing={0} flex={1}>
        <Stack
          component="ul"
          direction="column"
          spacing={0}
          sx={{
            backgroundColor: 'white',
            listStyle: 'none',
            margin: 0,
            padding: 4,
            width: 300,
          }}
        >
          <Typography
            component="li"
            fontWeight="bold"
            sx={{
              marginBottom: 2,
            }}
          >
            Categories
          </Typography>
          <Typography
            component="li"
            sx={{
              backgroundColor: '#D9EEFE',
              borderRight: '4px solid',
              borderColor: 'primary.main',
              padding: '1rem 2rem',
              marginLeft: '-2rem !important',
              marginRight: '-2rem !important',
            }}
          >
            Input Units
          </Typography>
          <Typography
            component="li"
            sx={{
              padding: '1rem 2rem',
              marginLeft: '-2rem !important',
              marginRight: '-2rem !important',
            }}
          >
            Input Streams
          </Typography>
          <Typography
            component="li"
            sx={{
              padding: '1rem 2rem',
              marginLeft: '-2rem !important',
              marginRight: '-2rem !important',
            }}
          >
            Unit Costing
          </Typography>
        </Stack>
        <Box flex={1} sx={{ overflow: 'hidden' }}>
          <Container
            maxWidth="xl"
            sx={{
              mt: 4,
            }}
          >
            <Paper>
              <DataGrid
                rows={state.inputs.table.data || []}
                getRowId={(row) => row[state.inputs.table.dataIdField]}
                columns={state.inputs.table.columns}
                disableColumnSelector
                disableRowSelectionOnClick
              />
            </Paper>
          </Container>
        </Box>
      </Stack>
      <Box
        sx={{
          backgroundColor: 'white',
          borderTop: '1px solid',
          borderColor: 'neutral.main',
          bottom: 0,
          padding: 2,
          position: 'fixed',
          textAlign: 'right',
          width: '100%',
        }}
      >
        <AppLink to="/run-computation/$id/settings" params={{ id }}>
          <Button variant="contained" data-testid="rnc-settings-next-button">
            Continue to Optimization Settings
          </Button>
        </AppLink>
      </Box>
    </Stack>
  );
}
