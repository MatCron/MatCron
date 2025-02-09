

// import React, { useState } from "react";
// import {
//   TextField,
//   Button,
//   Checkbox,
//   Typography,
//   Box,
//   FormControlLabel,
//   Link,
//   IconButton,
//   InputAdornment,
// } from "@mui/material";
// import { styled } from "@mui/system";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import backgroundImage from "../assets/images/bed.jpg";
// import logo from "../assets/images/MATCRON_Logo.png"; // Import the logo

// const CustomButton = styled(Button)({
//   backgroundColor: "#00C1D4",
//   color: "#fff",
//   fontWeight: "bold",
//   fontSize: "18px",
//   padding: "10px 0",
//   textTransform: "none",
//   borderRadius: "25px",
//   "&:hover": {
//     backgroundColor: "#008E9B",
//   },
// });

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     alert(`Email: ${email}, Password: ${password}, Remember Me: ${rememberMe}`);
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword((prev) => !prev);
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         height: "100vh",
//         alignItems: "center",
//         justifyContent: "center",
//         backgroundImage: `url(${backgroundImage})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         position: "relative",
//       }}
//     >
//       {/* Transparent Overlay */}
//       <Box
//         sx={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundColor: "rgba(0, 0, 0, 0.4)", // Semi-transparent black overlay
//           zIndex: -1,
//         }}
//       />
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           maxWidth: "500px",
//           width: "100%",
//           backgroundColor: "rgba(255, 255, 255, 0.9)", // Transparent white background
//           boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
//           borderRadius: "10px",
//           padding: "40px",
//         }}
//       >
//         {/* Logo and MatCron Text */}
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             marginBottom: "30px",
//           }}
//         >
//           <img
//             src={logo} // Use the imported logo
//             alt="Logo"
//             style={{ width: "100px", marginRight: "10px" }}
//           />
//           <Typography
//             variant="h4"
//             sx={{
//               fontWeight: "bold",
//               color: "#333",
//             }}
//           >
//             Mat<span style={{ color: "#00C1D4" }}>Cron</span>
//           </Typography>
//         </Box>

//         {/* Login Form */}
//         <Typography
//           variant="h6"
//           sx={{
//             color: "#555",
//             marginBottom: "10px",
//           }}
//         >
//           Welcome Back!
//         </Typography>
//         <Typography
//           variant="body1"
//           sx={{
//             color: "#888",
//             marginBottom: "30px",
//           }}
//         >
//           Sign in by entering the information below
//         </Typography>

//         <form onSubmit={handleSubmit}>
//           <TextField
//             fullWidth
//             label="Email Address"
//             variant="outlined"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             sx={{ marginBottom: "20px" }}
//           />
//           <TextField
//             fullWidth
//             label="Password"
//             type={showPassword ? "text" : "password"}
//             variant="outlined"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             sx={{ marginBottom: "20px" }}
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton onClick={togglePasswordVisibility} edge="end">
//                     {showPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               marginBottom: "20px",
//             }}
//           >
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={rememberMe}
//                   onChange={(e) => setRememberMe(e.target.checked)}
//                   sx={{ color: "#00C1D4" }}
//                 />
//               }
//               label="Remember Me"
//             />
//             <Link href="#" sx={{ color: "#00C1D4", textDecoration: "none" }}>
//               Forgotten Password?
//             </Link>
//           </Box>
//           <CustomButton fullWidth type="submit">
//             Continue
//           </CustomButton>
//         </form>

//         <Typography
//           variant="body2"
//           align="center"
//           sx={{ marginTop: "20px", color: "#888" }}
//         >
//           Don’t have an account?{" "}
//           <Link href="#" sx={{ color: "#00C1D4", textDecoration: "none" }}>
//             Create One here
//           </Link>
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// export default Login;



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
} from "@mui/material";
import { styled } from "@mui/system";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import backgroundImage from "../assets/images/bed.jpg";
import logo from "../assets/images/MATCRON_Logo.png"; // Import the logo

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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Email: ${email}, Password: ${password}, Remember Me: ${rememberMe}`);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
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
              marginBottom: { xs: "10px", md: "0" },
              marginRight: { md: "10px" },
            }}
          />
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#333",
              fontSize: { xs: "24px", md: "32px" }, // Adjust font size for small screens
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
          Don’t have an account?{" "}
          <Link href="#" sx={{ color: "#00C1D4", textDecoration: "none" }}>
            Create One here
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
