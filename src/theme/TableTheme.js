import { createTheme } from "@mui/material";

const tableTheme = createTheme({
    palette: {
        primary: {
            main: '#7058c6',
            light: '#d0f2f2',
            dark: '#68a3a4',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#ff6f61',
            light: '#ffa899',
            dark: '#c53f36',
            contrastText: '#FFFFFF',
        },
        error: {
            main: '#e57373',
            light: '#ffadad',
            dark: '#af4448',
            contrastText: '#FFFFFF',
        },
        warning: {
            main: '#ffb74d',
            light: '#ffe97d',
            dark: '#c88719',
            contrastText: '#FFFFFF',
        },
        info: {
            main: '#64b5f6',
            light: '#9be7ff',
            dark: '#2286c3',
            contrastText: '#FFFFFF',
        }
    },
    typography: {
        fontFamily: 'calibri',
        fontSize: 14,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightBold: 700,
    },
    components: {
        MuiTable: {
            styleOverrides: {
                root: {   
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                    borderCollapse: 'separate', 
                }, 
            },  
        },
        MuiTableCell: {
            styleOverrides: {
                root: { 
                    borderBottom: '1px solid #E0E0E0', 
                },
                head: {
                    fontWeight: 'bold',
                    color: '#7058c6',  
                },
                body: {
                    color: '#333',
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: '#F3F3F3',
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: '#7058c6',
                    '&:hover': {
                        backgroundColor: '#F3F3F3',
                    },
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:nth-of-type(odd)': {
                        backgroundColor: '#F3F3F3',
                    },
                    '&.MuiTableHeadRow-root': {
                        backgroundColor: '#D9D9D9',
                    },
                    '&:last-child td, &:last-child th': {
                        border: 0,
                    },
                    '&:hover': {
                        backgroundColor: '#F0F0F0',
                    },
                },
            },
        },
        MuiPaper:{
            styleOverrides:{
                root:{
                    backgroundColor: '#F5F5F5', 
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '4px',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    padding: '10px 20px',
                    transition: 'all 0.3s ease-in-out',
                    height: '30px',
                    '&:hover': {
                        boxShadow: '1px 1px 4px rgba(0, 0, 0, 0.25)',
                    },
                },
                contained: {
                    '&:hover': {
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                    },
                },
                outlined: {
                    '&:hover': {
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                    },
                },
            },
        }, 
    },
});

export default tableTheme;
