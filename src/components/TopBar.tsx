import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import {
  AppBar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { cleanPath } from '../utils/queryParams.utils';
import { AppLink } from './AppLink';
import { ImageWrapper } from './ImageWrapper';

/**
 * Top navigation bar component
 */
export const TopBar: React.FC = () => {
  const { user, isAuthenticated, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    signOut();
    handleMenuClose();
  };

  return (
    <AppBar
      color="default"
      position="static"
      component="nav"
      sx={{
        backgroundColor: 'white',
        borderBottom: '1px solid',
        borderBottomColor: 'grey.300',
        boxShadow: 'none',
      }}
    >
      <Toolbar>
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            flexGrow: 1,
          }}
        >
          <AppLink to="/">
            <ImageWrapper height={30}>
              <img
                src={cleanPath(
                  `${import.meta.env.BASE_URL}/strudel-logo-icon.png`
                )}
              />
            </ImageWrapper>
          </AppLink>
          <AppLink to="/">
            <Typography variant="h6" component="div" fontWeight="bold">
              My Project
            </Typography>
          </AppLink>
        </Stack>
        {isAuthenticated ? (
          <>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              onClick={handleMenuOpen}
              aria-controls={menuOpen ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={menuOpen ? 'true' : undefined}
            >
              <AccountCircleIcon />
            </IconButton>
            <Menu
              id="account-menu"
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
              MenuListProps={{
                'aria-labelledby': 'account-button',
              }}
            >
              <MenuItem disabled>
                <Typography variant="body2" fontWeight="bold">
                  {user?.name}
                </Typography>
              </MenuItem>
              <MenuItem disabled>
                <Typography variant="body2" color="text.secondary">
                  {user?.email}
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} fontSize="small" />
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Stack direction="row" spacing={1}>
            <AppLink to="/auth/sign-in">
              <Button variant="outlined">Sign In</Button>
            </AppLink>
            <AppLink to="/auth/sign-up">
              <Button variant="contained">Sign Up</Button>
            </AppLink>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
};
