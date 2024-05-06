import { TextField, Box, Grid, Button } from "@mui/material";

export default function Text2ImagePage() {
  function handleSubmit() {
    //To DO
  }
  return (
    <Box display="flex" justifyContent="center">
      <Grid sx={{ my: "5em", mx: "0" }}>
        <TextField required id="prompt" label="Prompt"></TextField>
        <Button variant="contained" sx={{ my: "0.5em", ml: "0.8em" }}>
          Submit
        </Button>
      </Grid>
    </Box>
  );
}
