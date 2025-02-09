// import React, { useState } from "react";
// import { TextField, Button, Typography, Container, Box } from "@mui/material";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!email || !password) {
//       setError("Please fill in all fields.");
//     } else {
//       setError("");
//       alert(`Logged in with Email: ${email}`);
//     }
//   };

//   return (
//     <Container
//       maxWidth="sm"
//       className="d-flex flex-column justify-content-center align-items-center vh-100"
//     >
//       <Box
//         component="form"
//         onSubmit={handleSubmit}
//         className="shadow-lg p-4 rounded"
//         style={{ backgroundColor: "#fff", width: "100%" }}
//       >
//         <Typography variant="h4" align="center" gutterBottom>
//           Login
//         </Typography>
//         {error && (
//           <Typography
//             variant="body2"
//             color="error"
//             className="text-center mb-3"
//           >
//             {error}
//           </Typography>
//         )}
//         <TextField
//           label="Email"
//           type="email"
//           fullWidth
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           margin="normal"
//           required
//         />
//         <TextField
//           label="Password"
//           type="password"
//           fullWidth
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           margin="normal"
//           required
//         />
//         <Button
//           type="submit"
//           variant="contained"
//           color="primary"
//           fullWidth
//           className="mt-3"
//         >
//           Login
//         </Button>
//       </Box>
//     </Container>
//   );
// };

// export default Login;
