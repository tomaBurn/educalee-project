import React, { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

export const withSnackbar = (WrappedComponent) => {
  return (props) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("I'm a custom snackbar");
    const [duration, setDuration] = useState(2000);
    const [severity, setSeverity] = useState("success");

    const showMessage = (message, severity, duration = 2000) => {
      setMessage(message);
      setSeverity(severity);
      setDuration(duration);
      setOpen(true);
    };

    const handleClose = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      setOpen(false);
    };

    return (
      <>
        <WrappedComponent {...props} snackbarShowMessage={showMessage} snackB />
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          autoHideDuration={duration}
          open={open}
          onClose={handleClose}
        >
          <MuiAlert variant="filled" onClose={handleClose} severity={severity}>
            {message}
          </MuiAlert>
        </Snackbar>
      </>
    );
  };
};
