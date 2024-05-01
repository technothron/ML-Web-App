import { Box, Card, CardMedia, Typography, Grid, Paper } from "@mui/material";

export default function HomePage() {
  const images = [
    "stable diffusion.png",
    "stable diffusion.webp",
    "stable diffusion1.jpg",
    "stable diffusion2.png",
    "stable diffusion3.webp",
    "stable diffusion4.webp",
    "stable diffusion5.jpg",
  ];
  return (
    <Box>
      <Box
        position={"relative"}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: "4em",
            mt: "1em",
            justifyContent: "center",
          }}
        >
          Welcome to the world of Stable Diffusion
        </Typography>
      </Box>
      <Box
        display={"flex"}
        flexDirection={"row"}
        sx={{ my: "0.1em", mx: "1.5em" }}
        flexWrap={"wrap"}
        justifyContent={"center"}
      >
        {images.map((img) => {
          console.log(img);
          return (
            <Paper
              elevation={12}
              sx={{
                "&:hover": { transform: "translate3D(0,-1px,0) scale(1.03)" },
                m: "1em",
              }}
            >
              <Card sx={{ height: "194", width: "194" }}>
                <CardMedia
                  component="img"
                  height="194"
                  width="194"
                  image={img}
                  alt="Diffusion"
                />
              </Card>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
}
