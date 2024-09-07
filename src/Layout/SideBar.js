import * as React from 'react';
import { Button, Box, Divider, Icon } from '@mui/material';
import NavItem from '../Components/NavItem';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import GroupsIcon from '@mui/icons-material/Groups';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Logo from '../assets/logo.png';
import theme from '../theme/Theme';
import { useNavigate } from 'react-router-dom';
import { HomeRepairService, Person3 } from '@mui/icons-material';

const SideBar = () => {
    const user = JSON.parse(localStorage.getItem('staff'))
    const navigate = useNavigate();

    const logOut =() =>{
        localStorage.clear()
        navigate('/login')
        window.location.reload()
    } 
    return (
        <Box sx={{
            position: 'fixed',
            width: 230,
            height: '100vh',
            top: '0px',
            backgroundColor: theme.palette.primary.light,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'start',
            alignItems: 'center',
            paddingTop: '40px'
        }} >
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '71px',
                marginBottom: '50px',
                backgroundColor: '#d0f2f2',
            }} >
                <img src={Logo} height={'180px'} width={'260px'} />
                
            </div> 
            <NavItem name="Dashboard" path="/" icon={<DashboardIcon />} />
            <NavItem name="Items" path="/item" icon={<ConfirmationNumberIcon />} />
            <NavItem name="Repairs" path="/repair" icon={<HomeRepairService />} />
            <NavItem name="Staff" path="/staff" icon={<Person3 />} />
            <Button
                variant='text'
                sx={{
                    width: 180,
                    height: '35px',
                    color: '#ff0053',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'start',
                    fontWeight: 'normal',
                    alignItems: 'center',
                    textTransform: 'none',
                    boxShadow: 'none',
                    marginTop: '10px',
                    transition: 'all 0.3s ease-in-out',
                }}
                onClick={() => logOut()}
            >
                <Icon sx={{
                    width: '25px',
                    height: '25px',
                    marginRight: '18px',
                    marginBottom: '10px',
                }}
                >
                    <ExitToAppIcon />
                </Icon>
                Logout
            </Button>
        </Box>
    );
}

export default SideBar;
