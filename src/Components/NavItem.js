import { Button, Icon } from '@mui/material';
import React from 'react';
import { useLocation } from 'react-router-dom';
import theme from '../theme/Theme';

const NavItem = (props) => {
    const { name, path, icon } = props;
    const location = useLocation();

    return (
        <Button
            component="a"
            href={path}
            color='primary'
            sx={{
                width: 180,
                height: '35px',
                backgroundColor: location.pathname == path && '#7058C6',
                color: location.pathname == path ? '#ffffff' : '#7058C6',
                boxShadow: location.pathname == path ? '0px 0px 4px #1c1c1c' : 'none',
                fontWeight: location.pathname == path ? 'bold' : 'normal',
                display: 'flex',
                textTransform: 'none',
                flexDirection: 'row',
                justifyContent: 'start',
                alignItems: 'center',
                marginTop: '10px',
                marginBottom: '10px',
                fontSize:'14px',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    backgroundColor: location.pathname == path && theme.palette.primary.dark,
                }
            }} >
            <Icon sx={{
                width: '24px',
                height: '24px',
                marginRight: '18px',
                marginBottom: '10px',
            }} >
                {icon}
            </Icon>
            {name}
        </Button>
    );
}

export default NavItem;