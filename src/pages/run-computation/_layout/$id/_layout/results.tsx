import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { AppLink } from '../../../../../components/AppLink';
import { useRunComputation } from '../../../-context/ContextProvider';
import {
  setResultsBarChartData,
  setResultsLineChartData,
  setResultsTableData,
} from '../../../-context/actions';
import {
  getScenarioById,
  updateScenario,
} from '../../../../../services/scenarioService';
import { Scenario } from '../../../../../types/scenario.types';

export const Route = createFileRoute(
  '/run-computation/_layout/$id/_layout/results'
)({
  component: ResultsPage,
});

/**
 * Results page to display after a computation completes in the run-computation Task Flow.
 * Displays a line chart, bar chart, and table of results from the computation.
 */
function ResultsPage() {
  const { state, dispatch } = useRunComputation();
  const { id } = useParams({
    from: '/run-computation/_layout/$id/_layout/results',
  });
  const [scenario, setScenario] = useState<Scenario | null>(null);

  /**
   * Load scenario data when component mounts
   */
  useEffect(() => {
    const loadedScenario = getScenarioById(id);
    if (loadedScenario) {
      setScenario(loadedScenario);
      // Load results from scenario
      if (loadedScenario.results) {
        if (
          loadedScenario.results.table &&
          loadedScenario.results.table.length > 0
        ) {
          dispatch(setResultsTableData(loadedScenario.results.table));
        }
        if (
          loadedScenario.results.lineChart &&
          loadedScenario.results.lineChart.length > 0
        ) {
          dispatch(setResultsLineChartData(loadedScenario.results.lineChart));
        }
        if (
          loadedScenario.results.barChart &&
          loadedScenario.results.barChart.length > 0
        ) {
          dispatch(setResultsBarChartData(loadedScenario.results.barChart));
        }
      }
    }
  }, [id]);

  /**
   * Save results data back to scenario when it changes
   */
  useEffect(() => {
    if (
      scenario &&
      state.results.table.data &&
      state.results.table.data.length > 0
    ) {
      updateScenario(scenario.id, {
        results: {
          table: state.results.table.data,
          lineChart: state.results.lineChart.data,
          barChart: state.results.barChart.data,
        },
      });
    }
  }, [
    state.results.table.data,
    state.results.lineChart.data,
    state.results.barChart.data,
  ]);

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
        <Stepper activeStep={2} sx={{ maxWidth: 850 }}>
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
            Summary
          </Typography>
          <Typography
            component="li"
            sx={{
              padding: '1rem 2rem',
              marginLeft: '-2rem !important',
              marginRight: '-2rem !important',
            }}
          >
            System Costing
          </Typography>
          <Typography
            component="li"
            sx={{
              padding: '1rem 2rem',
              marginLeft: '-2rem !important',
              marginRight: '-2rem !important',
            }}
          >
            System Metrics
          </Typography>
        </Stack>
        <Box flex={1}>
          <Container
            maxWidth="xl"
            sx={{
              mt: 4,
            }}
          >
            <Grid container spacing={4}>
              <Grid item sm={6}>
                <Paper>
                  <Plot data={state.results.lineChart.data} layout={{}} />
                </Paper>
              </Grid>
              <Grid item sm={6}>
                <Paper>
                  <Plot data={state.results.barChart.data} layout={{}} />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper>
                  <DataGrid
                    rows={state.results.table.data || []}
                    getRowId={(row) => row[state.results.table.dataIdField]}
                    columns={state.results.table.columns}
                    disableColumnSelector
                    disableRowSelectionOnClick
                  />
                </Paper>
              </Grid>
            </Grid>
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
          width: '100%',
        }}
      >
        <AppLink to="/run-computation/$id/settings" params={{ id }}>
          {/* CUSTOMIZE: back to settings button */}
          <Button variant="contained">Back to Optimization Settings</Button>
        </AppLink>
      </Box>
    </Stack>
  );
}
