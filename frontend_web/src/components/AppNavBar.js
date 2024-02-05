import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Image from 'react-bootstrap/Image';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Link, useLocation } from 'react-router-dom';
import './controls.css';
import logo1 from '../images/PtBPLogo.png';

// Routes according to React-Router relative urls
const settings = [
    {
        page: 'Account',
        route: 'account'
    },
    {
        page: 'Logout',
        route: '/'
    }
];

// Updates state for token in session on refresh, back, 
const AppNavBar = (props) => {
    const location = useLocation();
    const segment = location.pathname.split('/');

    if(!location.state){
        location.state = {}
        location.state.userToken = props.passToken;
    }


    const invites = location?.state?.userToken?.user?.invites.length;
    
    const userName = {
        fN: location.state?.userToken?.user.firstname ? location.state?.userToken?.user.firstname : 'Abc',
        lN: location.state?.userToken?.user.lastname ? location.state?.userToken?.user.lastname : 'Bcd',
        full: location.state?.userToken?.user?.lastname ? `${location.state?.userToken?.user?.firstname} ${location.state?.userToken?.user?.lastname}` : 'Abc Bcd'
    }

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    function handleLogOut() {
        setAnchorElUser(null);
        props.passLogout(false);
    }

    const segmentLink = (index) => {
        var i;
        var path = '';
        for (i = 1; i <= index; i++){
            path = `${path}/${segment[i]}`;
        }
        return(path);
    }

    //SVG Home icon link button
    const home = <Link className='homeButton' to='/home' state={location.state}><Image src={logo1} className='icon-shadow' alt='logo' height='50px' /></Link>;

    // Alternate versions for different screen widths
    return (
        <AppBar position='static'>
            <Container maxWidth='xl'>
                <Toolbar disableGutters>
                    <Typography
                        id='siteName'
                        variant='h6'
                        noWrap
                        sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
                    >
                        { home }
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size='large'
                            aria-label='account of current user'
                            aria-controls='menu-appbar'
                            aria-haspopup='true'
                            onClick={ handleOpenNavMenu }
                            color='inherit'
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id='menu-appbar'
                            anchorEl={ anchorElNav }
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={ Boolean(anchorElNav) }
                            onClose={ handleCloseNavMenu }
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            { segment.map((page, index) => (
                                !/\d/.test(page) && page !== 'form' && page !== 'area' && page !== 'points' && page !== ':id' && index > 0 ?
                                    <MenuItem 
                                        key={ page } 
                                        component={ Link }
                                        to={ segmentLink(page === 'teams' || page === 'projects' || page === 'edit' ? index + 1 : index)}
                                        state={ location.state }
                                        onClick={ handleCloseNavMenu }>
                                        <Typography textAlign='center'> {page === 'teams' ? 'Projects' : (page === 'projects' ? 'Project Page' : `${page.charAt(0).toUpperCase()}${page.slice(1)}`)} </Typography>
                                    </MenuItem>
                                : null
                            )) }
                        </Menu>
                    </Box>
                    <Typography
                        variant='h6'
                        noWrap
                        sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
                    >
                        { home }
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        { segment.map((page, index) => (
                            !/\d/.test(page) && page !== 'form' && page !== 'area' && page !== 'points' && page !== ':id' && index > 0 ? 
                            <Button
                                component={ Link }
                                to={segmentLink(page === 'teams' || page === 'projects' || page === 'edit' ? index+1 : index) }
                                state={ location.state }
                                key={ page }
                                onClick={ handleCloseNavMenu }
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                    { page === 'teams' ? 'Projects' : (page === 'projects' ? 'Project Page' : page) }
                            </Button>
                            : null
                        )) }
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title='Open Menu'>
                            {invites > 0 ?
                                <Badge badgeContent={invites} color='error'>
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar>{`${userName.fN[0]}${userName.lN[0]}`}</Avatar>
                                    </IconButton>
                                </Badge>
                                : 
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar>{`${userName.fN[0]}${userName.lN[0]}`}</Avatar>
                                </IconButton>
                            }
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px', zIndex: 'tooltip' }}
                            id='menu-appbar'
                            anchorEl={ anchorElUser }
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={ Boolean(anchorElUser) }
                            onClose={ handleCloseUserMenu }
                        >
                            { settings.map((setting) => (
                                <MenuItem 
                                    component={ Link } 
                                    state={ setting.page === 'Account' ? {...location.state, from: location.pathname} : null }
                                    to={ setting.route } 
                                    key={ setting.page } 
                                    onClick={ setting.page === 'Account' ? handleCloseUserMenu : handleLogOut }
                                >
                                    <Typography textAlign='center'>{ setting.page }</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default AppNavBar;