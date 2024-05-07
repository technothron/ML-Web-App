import { TextField, Box, Grid, Button } from "@mui/material";
import { useState } from "react";
export default function Text2ImagePage() {
  const [responseImage, setResponseImage] = useState(null);
  const [prompt, setPrompt] = useState(null);
  async function handleSubmit() {
    if (!prompt) return;
    const url = "http://localhost:5000/api/generate_image_via_text"; // Assuming controller is on the same domain
    const data = { prompt: prompt };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=UTF-8", // Specify data is a plain text prompt
        },
        body: data.prompt,
      });

      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      const imageBlob = await response.blob();
      const reader = new FileReader();
      reader.onload = (e) => {
        setResponseImage(e.target.result);
      };
      reader.readAsDataURL(imageBlob);
      return;
    } catch (error) {
      console.error("Error sending request:", error);
      return;
    }
  }
  return (
    <>
      {!responseImage && (
        <Box display="flex" justifyContent="center">
          <Grid sx={{ my: "5em", mx: "0" }}>
            <TextField
              required
              id="prompt"
              label="Prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            ></TextField>
            <Button
              variant="contained"
              sx={{ my: "0.5em", ml: "0.8em" }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Grid>
        </Box>
      )}
      {responseImage && (
        <Box
          sx={{
            m: "1em",
            display: "flex",
            justifyContent: "center",
            flexWrap: "row",
          }}
        >
          <img
            src={responseImage}
            alt="Response"
            style={{ maxHeight: "200px" }}
          />
        </Box>
      )}
    </>
  );
}
