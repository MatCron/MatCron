import React from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import BedIcon from "@mui/icons-material/Bed";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import InventoryIcon from "@mui/icons-material/Inventory";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

const widgetData = [
  { title: "Total Mattresses", value: 100, icon: <BedIcon />, color: "primary.main" },
  { title: "Need Washing", value: 15, icon: <LocalLaundryServiceIcon />, color: "error.main" },
  { title: "Need Rotation", value: 12, icon: <RotateRightIcon />, color: "warning.main" },
  { title: "In Storage", value: 8, icon: <InventoryIcon />, color: "success.main" },
];

const Dashboard = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <Navbar />
      <Sidebar open={false} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: "100px", ml: { xs: 0, md: "72px" } }}>
        <Typography variant="h4">Mattress Management Dashboard</Typography>
        <Grid container spacing={3} sx={{ mt: 3 }}>
          {widgetData.map((widget, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper sx={{ p: 3, textAlign: "center" }}>
                <Box sx={{ fontSize: 50, color: widget.color }}>{widget.icon}</Box>
                <Typography variant="h6">{widget.value}</Typography>
                <Typography>{widget.title}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
