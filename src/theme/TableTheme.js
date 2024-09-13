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
                    width: '100%',
                    borderTop: '1px solid #7058c6',
                    maxWidth: '100%',
                    overflowX: 'auto',
                    tableLayout: 'fixed',   
                    height: '700px', 
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: { 
                    padding: '5px 10px',
                    borderBottom: '1px solid #E0E0E0',
                },
                head: {
                    fontWeight: 'bold',
                    color: '#7058c6', 
                    padding: '8px',
                    backgroundColor: '#E2DEF4',
                },
                body: {
                    color: '#333',
                    lineHeight: 1.5,
                    padding: '8px',
                    height: '48px',  // Ensure height remains fixed
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    height: '48px',  // Fixed height for rows
                    backgroundColor: '#E2DEF4', 
                    '&:nth-of-type(odd)': {
                        backgroundColor: '#E2DEF4',  // Alternate row color
                    },
                    '&:hover': {
                        backgroundColor: '#E2DEF4',  // Hover color
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
        MuiPagination: {
            styleOverrides: {
                root: {
                    borderRadius: '4px',
                    backgroundColor: '#E2DEF4',
                },
                item: {
                    color: '#7058c6',
                    '&:hover': {
                        backgroundColor: '#D0D0D0',
                    },
                },
                page: {
                    '&.Mui-selected': {
                        backgroundColor: '#7058c6',
                        color: '#FFFFFF',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: '#E2DEF4',
                },
            },
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
