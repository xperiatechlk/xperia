import { Avatar, Toolbar } from '@mui/material';
import theme from '../theme/Theme';
import Logo from '../assets/logo.png';
import React from 'react';

const TopToolBar = () => {
    const user = JSON.parse(localStorage.getItem('staff'))

    
    return (
        <div>
            <Toolbar
                sx={{
                    height: '35px',
                    backgroundColor: '#d0f2f2',
                    color: '#2d375c',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    fontWeight: 'normal',
                    fontFamily: 'calibri',
                    transition: 'all 0.3s ease-in-out',
                    position:'fixed',
                    width:'86%',
                    top:'0px',
                    zIndex:'999',
                }}
                variant="regular">
               
               
            </Toolbar>
        </div>
    );
};

export default TopToolBar;