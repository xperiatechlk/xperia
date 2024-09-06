import { Avatar, Toolbar } from '@mui/material';
import theme from '../theme/Theme';
import Logo from '../assets/logo.png';
import React from 'react';

const TopToolBar = () => {
    const user = JSON.parse(localStorage.getItem('staff'))

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
               
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '10px',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontFamily: 'calibri',
                        fontWeight: 'normal',
                        color: '#2d375c',
                        fontSize: '18px',
                    }}>
                    Welcome {user?.firstName + ' ' + user?.lastName}
                    <Avatar {...stringAvatar(user?.firstName + ' ' + user?.lastName)} />
                </div>
            </Toolbar>
        </div>
    );
};

export default TopToolBar;