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
  Typography,
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
    if (!selectedImage || !attack) {
      alert("Please select an image and enter a attack"); // User-friendly alert
      return;
    }
    let url = "http://127.0.0.1:5000/api/";
    if (attack == "FGSM") url += "FGSM";
    if (attack == "GradientAttack") url += "gradient_attack";
    if (attack == "GradientSignAttack") url += "gradient_sign_attack";
    if (attack == "FastFeatureAttack") url += "fast_feature_attack";
    if (attack == "L2BasicIterativeAttack") url += "l2_basic_iterative_attack";
    if (attack == "LinfBasicIterativeAttack")
      url += "linf_basic_iterative_attack";
    if (attack == "PGDAttack") url += "pgd_attack";
    if (attack == "LinfPGDAttack") url += "linf_pgd_attack";
    if (attack == "L2PGDAttack") url += "l2_pgd_attack";
    if (attack == "L1PGDAttack") url += "l1_pgd_attack";
    if (attack == "SparseL1DescentAttack") url += "sparse_l1_descent_attack";
    if (attack == "MomentumIterativeAttack") url += "momentum_iterative_attack";
    if (attack == "LinfMomentumIterativeAttack")
      url += "linf_momentum_iterative_attack";
    if (attack == "L2MomentumIterativeAttack")
      url += "l2_momentum_iterative_attack";
    if (attack == "CarliniWagnerL2Attack") url += "carlini_wagner_l2_attack";
    if (attack == "DDNL2Attack") url += "ddn_l2_attack";
    if (attack == "LBFGSAttack") url += "lbfgs_attack";
    if (attack == "SinglePixelAttack") url += "single_pixel_attack";
    if (attack == "ElasticNetL1Attack") url += "elastic_net_l1_attack";
    if (attack == "LocalSearchAttack") url += "local_search_attack";
    if (attack == "SpatialTransformAttack") url += "spatial_transform_attack";
    if (attack == "JacobianSaliencyMapAttack")
      url += "jacobian_saliency_map_attack";
    const formData = new FormData();
    formData.append("data", selectedImage);
    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
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
        <>
          <Box
            sx={{
              m: "1em",
              display: "flex",
              justifyContent: "center",
              flexWrap: "row",
            }}
          >
            <Typography variant="h2">{`Image Attacked with ${attack}`}</Typography>
          </Box>

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
        </>
      )}
    </>
  );
}
