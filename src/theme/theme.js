import {createTheme} from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#0098ff',
            light: '#4db8ff',
            dark: '#0078cc',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#162d50',
            light: '#3d5577',
            dark: '#0f1f38',
            contrastText: '#ffffff',
        },
        tertiary: {
            main: '#00112b',
            light: '#1a2b45',
            dark: '#000a1a',
            contrastText: '#ffffff',
        },
        text: {
            primary: '#162d50',
            secondary: '#999999',
        },
        background: {
            default: '#fafafa',
            paper: '#ffffff',
        },
        grey: {
            500: '#999999',
        },
    },
    typography: {
        fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 700,
            fontSize: '2.5rem',
            color: '#162d50',
        },
        h2: {
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 700,
            fontSize: '2rem',
            color: '#162d50',
        },
        h3: {
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 700,
            fontSize: '1.75rem',
            color: '#162d50',
        },
        h4: {
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 700,
            fontSize: '1.5rem',
            color: '#162d50',
        },
        h5: {
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 600,
            fontSize: '1.25rem',
            color: '#162d50',
        },
        h6: {
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 600,
            fontSize: '1.125rem',
            color: '#162d50',
        },
        body1: {
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 400,
            fontSize: '1rem',
            lineHeight: 1.6,
        },
        body2: {
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 400,
            fontSize: '0.875rem',
            lineHeight: 1.5,
        },
        button: {
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 600,
            textTransform: 'none',
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    padding: '12px 32px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0, 152, 255, 0.3)',
                    },
                },
                contained: {
                    background: 'linear-gradient(135deg, #0098ff 0%, #0078cc 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #0078cc 0%, #005aa3 100%)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 12,
                        backgroundColor: '#fafafa',
                        '& fieldset': {
                            borderColor: 'rgba(153, 153, 153, 0.3)',
                        },
                        '&:hover fieldset': {
                            borderColor: '#0098ff',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#0098ff',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: '#999999',
                        '&.Mui-focused': {
                            color: '#0098ff',
                        },
                    },
                },
            },
        },
    },
});

export default theme;