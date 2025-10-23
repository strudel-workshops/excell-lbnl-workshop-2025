import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { AppLink } from '../../../components/AppLink';
import { useAuth } from '../../../context/AuthContext';

export const Route = createFileRoute('/auth/_layout/sign-up')({
  component: SignUp,
});

/**
 * Sign-up page component
 */
function SignUp() {
  const navigate = useNavigate();
  const { signUp, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await signUp(email, password, name);
      // Redirect to home page after successful sign up
      navigate({ to: '/' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center">
        Create Account
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        gutterBottom
        textAlign="center"
        sx={{ mb: 3 }}
      >
        Sign up to get started with your account.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Full Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            disabled={isLoading}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={isLoading}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            disabled={isLoading}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            disabled={isLoading}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </Stack>
      </form>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <AppLink to="/auth/sign-in">
            <Typography
              component="span"
              variant="body2"
              color="primary"
              sx={{ fontWeight: 'bold' }}
            >
              Sign In
            </Typography>
          </AppLink>
        </Typography>
      </Box>
    </Box>
  );
}
