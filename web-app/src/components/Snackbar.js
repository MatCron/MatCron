import React from "react";
import { Snackbar, Alert } from "@mui/material";

const CustomSnackbar = ({ open, handleClose, message, severity }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={8000} // Automatically hides after 3 seconds
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
