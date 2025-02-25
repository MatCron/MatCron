import React from "react";
import { Box } from "@mui/material";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

const Dashboard = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <Navbar />
      <Sidebar open={false} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: "100px",
          ml: { xs: 0, md: "72px" },
        }}
      >
        <h1>Welcome to the Mattress Management Dashboard</h1>
      </Box>
    </Box>
  );
};

export default Dashboard;
