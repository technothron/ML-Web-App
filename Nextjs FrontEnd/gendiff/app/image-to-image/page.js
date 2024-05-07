"use client";
import { Box, Button, Grid, TextField } from "@mui/material";
import { useState, useRef } from "react";
export default function Image2ImagePage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [responseImage, setResponseImage] = useState(null);
  const [prompt, setPrompt] = useState("");
  const inputFileRef = useRef(null);
  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };

      reader.readAsDataURL(file);
    }
  };
  const handleButtonClick = () => {
    inputFileRef.current.click();
  };

  async function handleSubmit() {
    if (!selectedImage || !prompt) {
      alert("Please select an image and enter a prompt"); // User-friendly alert
      return;
    }

    const url = "http://localhost:5000/api/generate_image";

    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("image", selectedImage);

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status: ${response.status}. Error: ${errorText}`
        );
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
      alert("Error generating image. Please see the console for more info."); // Display error to user
    }
  }

  return (
    <>
      {!responseImage && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            m: "1.5em",
            mt: "5em",
          }}
        >
          <Grid display={"inline"}>
            <TextField
              required
              id="prompt"
              label="Image Prompt"
              sx={{ mx: "1em" }}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button
              variant="contained"
              sx={{ my: "1em" }}
              onClick={handleButtonClick}
            >
              Choose Image
            </Button>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              ref={inputFileRef}
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </Grid>
        </Box>
      )}
      {!responseImage && selectedImage && (
        <Box
          sx={{
            m: "1em",
            display: "flex",
            justifyContent: "center",
            flexWrap: "row",
          }}
        >
          <img
            src={selectedImage}
            alt="Selected"
            style={{ maxHeight: "200px" }}
          />
        </Box>
      )}
      {!responseImage && (
        <Box sx={{ m: "1em", display: "flex", justifyContent: "center" }}>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
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
