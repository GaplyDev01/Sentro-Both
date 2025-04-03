import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { 
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme,
  Avatar,
  Tooltip,
  Badge,
  SkipLink
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  Article as ArticleIcon,
  Bookmark as BookmarkIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Import responsive components
import ResponsiveTypography from '../common/ResponsiveTypography';

// Drawer width
const drawerWidth = 240;

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const navigate = useNavigate();
  const { currentUser, logout, isAdmin } = useAuth();

  // Adjust content padding based on screen size
  const contentPadding = isMobile ? 2 : (isTablet ? 3 : 4);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const drawer = (
    <Box role="navigation" aria-label="Main Navigation">
      <Toolbar>
        <ResponsiveTypography 
          variant="h6" 
          component="div"
          sx={{ fontWeight: 'bold' }}
        >
          News Impact
        </ResponsiveTypography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton 
            onClick={() => handleNavigation('/')}
            aria-label="Home"
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton 
            onClick={() => handleNavigation('/dashboard')}
            aria-label="Dashboard"
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton 
            onClick={() => handleNavigation('/news')}
            aria-label="News Feed"
          >
            <ListItemIcon>
              <ArticleIcon />
            </ListItemIcon>
            <ListItemText primary="News Feed" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton 
            onClick={() => handleNavigation('/bookmarks')}
            aria-label="Bookmarks"
          >
            <ListItemIcon>
              <BookmarkIcon />
            </ListItemIcon>
            <ListItemText primary="Bookmarks" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton 
            onClick={() => handleNavigation('/profile')}
            aria-label="Profile"
          >
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton 
            onClick={() => handleNavigation('/settings')}
            aria-label="Settings"
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
        {isAdmin() && (
          <ListItem disablePadding>
            <ListItemButton 
              onClick={() => handleNavigation('/admin')}
              aria-label="Admin Dashboard"
            >
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Admin Dashboard" />
            </ListItemButton>
          </ListItem>
        )}
        <ListItem disablePadding>
          <ListItemButton 
            onClick={handleLogout}
            aria-label="Logout"
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Skip link for keyboard users to bypass navigation */}
      <Box 
        sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          zIndex: theme.zIndex.tooltip + 1,
          '& a': {
            position: 'absolute',
            width: 1,
            height: 1,
            overflow: 'hidden',
            clip: 'rect(1px, 1px, 1px, 1px)',
            whiteSpace: 'nowrap',
            textDecoration: 'none',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            p: 2,
            m: 1,
            fontWeight: 'bold',
            '&:focus': {
              width: 'auto',
              height: 'auto',
              clip: 'auto',
              overflow: 'visible',
            },
          }
        }}
      >
        <a href="#main-content">Skip to main content</a>
      </Box>
      
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
        }}
        component="header"
        role="banner"
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            aria-controls="navigation-drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }}>
            <ResponsiveTypography 
              variant="h6" 
              mobileVariant="subtitle1"
              component="div" 
              noWrap
            >
              {currentUser?.businessName || 'News Impact Platform'}
            </ResponsiveTypography>
          </Box>
          
          {/* Notification icon visible on all screens */}
          <Tooltip title="Notifications">
            <IconButton 
              color="inherit" 
              sx={{ mr: 1 }}
              aria-label="Notifications"
            >
              <Badge badgeContent={3} color="primary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          {/* User avatar visible only on medium and larger screens */}
          <Tooltip title={currentUser?.displayName || 'User'}>
            <Avatar 
              alt={currentUser?.displayName || 'User'} 
              src={currentUser?.photoURL} 
              sx={{ 
                display: { xs: 'none', md: 'flex' },
                width: 36, 
                height: 36,
                cursor: 'pointer'
              }}
              onClick={() => handleNavigation('/profile')}
              role="button"
              tabIndex={0}
              aria-label="Go to profile"
            >
              {(currentUser?.displayName || 'U')[0]}
            </Avatar>
          </Tooltip>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="navigation menu"
      >
        {/* Mobile drawer */}
        <Drawer
          id="navigation-drawer"
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        id="main-content"
        tabIndex={-1}
        sx={{
          flexGrow: 1,
          p: contentPadding,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginTop: '64px',
          minHeight: 'calc(100vh - 64px)',
          bgcolor: 'background.default',
          outline: 'none',
        }}
        role="main"
        aria-label="Main content"
      >
        <Outlet />
      </Box>
      
      <Box
        component="footer"
        sx={{
          mt: 'auto',
          py: 2,
          px: contentPadding,
          bgcolor: 'background.paper',
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          textAlign: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
        role="contentinfo"
      >
        <ResponsiveTypography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} News Impact Platform. All rights reserved.
        </ResponsiveTypography>
      </Box>
    </Box>
  );
} 