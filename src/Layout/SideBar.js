import * as React from 'react';
import { Button, Box, Divider, Icon, Avatar } from '@mui/material';
import NavItem from '../Components/NavItem';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import GroupsIcon from '@mui/icons-material/Groups';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Logo from '../assets/logo.png';
import theme from '../theme/Theme';
import { useNavigate } from 'react-router-dom';
import { AccountCircle, DevicesOther, HomeRepairService, MonetizationOn, MoneyOffCsred, Person3 } from '@mui/icons-material';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';

const SideBar = () => {
    const user = JSON.parse(localStorage.getItem('staff'))
    const navigate = useNavigate();
    function stringToColor(string) {
        let hash = 0;
        let i;

        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */

        return color;
    }

    function stringAvatar(name) {
        return {
            sx: {
                bgcolor: stringToColor(name),
                marginRight: '20px'
            },
            children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        };
    }
    const logOut = () => {
        confirmAlert({
            title: 'Xperia Technology',
            message: "Are you sure you want to log out?",
            buttons: [
                {
                    label: 'Logout',
                    onClick: () => { 
                        localStorage.clear()
                        navigate('/login')
                        window.location.reload()
                    }
                },
                {
                    label: 'cancle',
                    onClick: () => {
                        
                    }
                }
            ]
        });
    }
    return (
        <Box sx={{
            position: 'fixed',
            width: 230,
            height: '100vh',
            top: '0px',
            backgroundColor: '#E2DEF4',
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
                marginBottom: '10px',
                backgroundColor: '#E2DEF4',
            }} >
                <img src={Logo} height={'180px'} width={'220px'} />

            </div>

            <Button variant='text' sx={{
                marginBottom: '10px',
                width: '80%',
                padding: '10px 0px',
            }}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        fontFamily: 'calibri',
                        fontWeight: 'normal',
                        color: '#2d375c',
                        fontSize: '18px',
                    }}>
                    <Avatar {...stringAvatar(user?.firstName + ' ' + user?.lastName)} />
                    <div style={{ textWrap: 'wrap' }}>{user?.firstName + ' ' + user?.lastName}</div>
                </div>
            </Button>

            <NavItem name="Dashboard" path="/" icon={<DashboardIcon />} />
            <NavItem name="Items" path="/item" icon={<DevicesOther />} />
            <NavItem name="Repairs" path="/repair" icon={<HomeRepairService />} />
            <NavItem name="Sales" path="/sales" icon={<MonetizationOn />} />
            {user?.role === 'admin' &&  <NavItem name="Staff" path="/staff" icon={<AccountCircle />} />}
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
