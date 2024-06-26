import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Drawer from "@/Components/Drawer";

export default function ButtonAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Drawer />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Stable Diffusion
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
