import { Box, Container, Stack } from '@mui/material';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { ImageWrapper } from '../../components/ImageWrapper';

export const Route = createFileRoute('/auth/_layout')({
  component: AuthLayout,
});

/**
 * Layout for authentication pages (sign-in, sign-up)
 */
function AuthLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'grey.100',
      }}
    >
      <Container maxWidth="sm">
        <Stack spacing={3} alignItems="center">
          <ImageWrapper height={60}>
            <img src="/strudel-logo-icon.png" alt="STRUDEL Logo" />
          </ImageWrapper>
          <Box
            sx={{
              width: '100%',
              backgroundColor: 'white',
              borderRadius: 2,
              padding: 4,
              boxShadow: 1,
            }}
          >
            <Outlet />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
