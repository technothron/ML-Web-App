"use client";
import { Box, Button, Grid, TextField } from "@mui/material";
import { useState, useRef } from "react";
export default function Image2ImagePage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [responseImage, setResponseImage] = useState(null);
  const inputFileRef = useRef(null);
  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        setSelectedImage(e.target.result); // Update state with image preview
      };

      reader.readAsDataURL(file);
    }
  };
  const handleButtonClick = () => {
    inputFileRef.current.click();
  };

  async function handleSubmit() {
    const response = await fetch("https://dummyimage.com/300", {
      method: "GET",
      responseType: "blob",
    });
    const result = await response.blob();
    const reader = new FileReader();
    reader.onload = (e) => {
      setResponseImage(e.target.result);
    };
    reader.readAsDataURL(result);
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
