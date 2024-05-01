import { Inter } from "next/font/google";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import "./globals.css";
import AppBar from "@/Components/AppBar";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Stable Diffusion Images",
  description: "Test adversarial attacks and download the images",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Box>
          <Grid>
            <AppBar />
            {children}
          </Grid>
        </Box>
      </body>
    </html>
  );
}
