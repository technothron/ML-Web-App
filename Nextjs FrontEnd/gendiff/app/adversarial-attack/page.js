"use client";
import {
  Box,
  Button,
  Grid,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,
} from "@mui/material";
import { useState, useRef } from "react";
export default function AdversarialAttackPage() {
  const attacksArray = [
    "FGSM",
    "GradientAttack",
    "GradientSignAttack",
    "FastFeatureAttack",
    "L2BasicIterativeAttack",
    "LinfBasicIterativeAttack",
    "PGDAttack",
    "LinfPGDAttack",
    "L2PGDAttack",
    "L1PGDAttack",
    "SparseL1DescentAttack",
    "MomentumIterativeAttack",
    "LinfMomentumIterativeAttack",
    "L2MomentumIterativeAttack",
    "CarliniWagnerL2Attack",
    "ElasticNetL1Attack",
    "DDNL2Attack",
    "LBFGSAttack",
    "SinglePixelAttack",
    "LocalSearchAttack",
    "SpatialTransformAttack",
    "JacobianSaliencyMapAttack",
  ];
  const [selectedImage, setSelectedImage] = useState(null);
  const [responseImage, setResponseImage] = useState(null);
  const [attack, setAttack] = useState("");
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
    const url = "http://localhost:5000/api/";
    let routeName = prompt.toLowerCase().replace(/([A-Z])/g, "_$1");
    url += routeName;
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
  const handleChange = (event) => {
    setAttack(event.target.value);
  };
  return (
    <>
      {!responseImage && (
        <>
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
          <Box
            sx={{ minWidth: 120 }}
            display={"flex"}
            justifyContent={"center"}
          >
            <FormControl fullWidth sx={{ width: "50%" }}>
              <InputLabel id="attack">Attacks</InputLabel>
              <Select
                labelId="attack"
                id="attack-select"
                value={attack}
                label="Attacks"
                onChange={handleChange}
              >
                {attacksArray.map((attack, index) => (
                  <MenuItem value={attack}>{attack}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </>
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
