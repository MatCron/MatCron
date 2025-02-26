import React, { useState } from "react";
import {
  TextField,
  Button,
  Checkbox,
  Typography,
  Box,
  FormControlLabel,
  Link,
  IconButton,
  InputAdornment,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { styled } from "@mui/system";
import backgroundImage from "../assets/images/bed.jpg";
import logo from "../assets/images/MATCRON_Logo.png"; // Import the logo
import CustomSnackbar from "../components/Snackbar"; // Import the Snackbar component
import { useNavigate } from 'react-router-dom';
import EncryptionService from "../services/EncryptionService";
import axios from "axios"; // Add this import

const CustomButton = styled(Button)({
  backgroundColor: "#00C1D4",
  color: "#fff",
  fontWeight: "bold",
  fontSize: "18px",
  padding: "10px 0",
  textTransform: "none",
  borderRadius: "25px",
  "&:hover": {
    backgroundColor: "#008E9B",
  },
});

// Create a custom theme to override the focus color
const customTheme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#00C1D4", // Teal border color when focused
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#00C1D4", // Teal border color on hover
            },
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: "#00C1D4", // Teal label color when focused
          },
        },
      },
    },
  },
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // 'success', 'error', 'warning', 'info'
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setSnackbar({
        open: true,
        message: "Please fill in all fields.",
        severity: "error",
      });
      return;
    }

    try {
      const encryptedPassword = EncryptionService.encryptPassword(password);
      
      const response = await axios.post('https://www.matcron.online/api/Auth/login', {
        email: email,
        password: encryptedPassword
      });

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: "Login successful!",
          severity: "success",
        });
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setSnackbar({
          open: true,
          message: response.data.message || "Login failed",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "An error occurred during login",
        severity: "error",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <ThemeProvider theme={customTheme}>
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          padding: { xs: "20px", md: "0" }, // Adjust padding for small screens
        }}
      >
        {/* Transparent Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)", // Semi-transparent black overlay
            zIndex: -1,
          }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: "500px",
            width: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.9)", // Transparent white background
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            borderRadius: "10px",
            padding: "40px",
          }}
        >
          {/* Logo and MatCron Text */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "30px",
              flexDirection: { xs: "column", md: "row" }, // Stack logo and text for small screens
              textAlign: "center",
            }}
          >
            <img
              src={logo} // Use the imported logo
              alt="Logo"
              style={{
                width: "80px", // Adjust size for responsiveness
              }}
            />
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "#333",
                fontSize: { xs: "24px", md: "32px" }, // Adjust font size for small screens
                marginLeft: { xs: "0px", md: "10px" }, // Add margin only for larger screens
              }}
            >
              Mat<span style={{ color: "#00C1D4" }}>Cron</span>
            </Typography>
          </Box>

          {/* Login Form */}
          <Typography
            variant="h6"
            sx={{
              color: "#555",
              marginBottom: "10px",
              fontSize: { xs: "16px", md: "20px" }, // Adjust font size for small screens
            }}
          >
            Welcome Back!
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#888",
              marginBottom: "30px",
              fontSize: { xs: "14px", md: "16px" }, // Adjust font size for small screens
            }}
          >
            Sign in by entering the information below
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ marginBottom: "20px" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
                flexDirection: { xs: "column", md: "row" }, // Stack elements for small screens
                gap: { xs: "10px", md: "0" }, // Add spacing between items for small screens
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    sx={{ color: "#00C1D4" }}
                  />
                }
                label="Remember Me"
              />
              <Link href="#" sx={{ color: "#00C1D4", textDecoration: "none" }}>
                Forgotten Password?
              </Link>
            </Box>
            <CustomButton fullWidth type="submit">
              Continue
            </CustomButton>
          </form>

          <Typography
            variant="body2"
            align="center"
            sx={{
              marginTop: "20px",
              color: "#888",
              fontSize: { xs: "14px", md: "16px" }, // Adjust font size for small screens
            }}
          >
            Don't have an account?{" "}
            <Link href="#" sx={{ color: "#00C1D4", textDecoration: "none" }}>
              Create One here
            </Link>
          </Typography>
        </Box>
        {/* Snackbar Component */}
        <CustomSnackbar
          open={snackbar.open}
          handleClose={handleCloseSnackbar}
          message={snackbar.message}
          severity={snackbar.severity}
        />
      </Box>
    </ThemeProvider>
  );
};

export default Login;
