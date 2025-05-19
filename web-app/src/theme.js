import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#008080', // Teal color
    },
    teal: {
      main: '#008080',
      dark: '#006666',
    },
    error: {
      main: '#d32f2f',
      dark: '#c62828',
    },
  },
});

export default theme; 