import React, { useState } from "react";
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Link,
  InputAdornment,
  useMediaQuery,
  useTheme,
  Chip,
  IconButton,
} from "@mui/material";
import {
  Mail,
  ArrowRight,
  Snowflake,
  Sun,
  Flower2,
  CloudRain,
  KeyRound, // Icon for password reset
  ArrowLeft, // Icon for back button
  ShieldCheck
} from "lucide-react";

// --- SEASONAL CONFIGURATION (Same as Login for consistency) ---
const SEASON_CONFIG = {
  winter: {
    name: "Winter Fest",
    primary: "#4f46e5", 
    gradient: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
    glassTint: "rgba(79, 70, 229, 0.15)",
    icon: Snowflake,
  },
  summer: {
    name: "Summer Chill",
    primary: "#f97316", 
    gradient: "linear-gradient(135deg, #f97316 0%, #c2410c 100%)",
    glassTint: "rgba(249, 115, 22, 0.15)",
    icon: Sun,
  },
  spring: {
    name: "Spring Bloom",
    primary: "#059669", 
    gradient: "linear-gradient(135deg, #059669 0%, #047857 100%)",
    glassTint: "rgba(5, 150, 105, 0.15)",
    icon: Flower2,
  },
  monsoon: {
    name: "Monsoon Sale",
    primary: "#0891b2", 
    gradient: "linear-gradient(135deg, #0891b2 0%, #0e7490 100%)",
    glassTint: "rgba(8, 145, 178, 0.15)",
    icon: CloudRain,
  },
};

const getSeason = () => {
  const month = new Date().getMonth();
  if (month === 10 || month === 11 || month === 0) return "winter";
  if (month === 1 || month === 2) return "spring";
  if (month >= 3 && month <= 5) return "summer";
  return "monsoon";
};

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  
  const muiTheme = useTheme();
  const isDesktop = useMediaQuery(muiTheme.breakpoints.up("md"));

  const currentSeasonKey = getSeason();
  const theme = SEASON_CONFIG[currentSeasonKey];
  const SeasonIcon = theme.icon;

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        // Mobile Edge-to-Edge (p:0), Desktop Floating (p:2)
        p: { xs: 0, md: 2 }, 
      }}
    >
      {/* ================= BACKGROUND VIDEO ================= */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          "&:after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.4)", 
          }
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        >
          {/* REPLACE with your actual 3D fruit video URL */}
          <source src="/assets/fruit-video.mp4" type="video/mp4" />
        </video>
      </Box>

      {/* ================= GLASS CARD ================= */}
      <Card
        sx={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          width: "100%",
          maxWidth: 1000,
          minHeight: { xs: "100vh", md: 600 },
          borderRadius: { xs: "0px", md: "30px" }, // Full screen on mobile
          background: "rgba(255, 255, 255, 0.8)", 
          backdropFilter: "blur(20px)",
          border: { xs: "none", md: "1px solid rgba(255, 255, 255, 0.5)" },
          boxShadow: { xs: "none", md: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" },
          overflow: { xs: "auto", md: "hidden" },
        }}
      >
        
        {/* --- LEFT SIDE: CONTEXT & SEASON --- */}
        <Box
          sx={{
            flex: { xs: "0 0 auto", md: 1 },
            background: theme.glassTint,
            p: { xs: 4, md: 8 },
            pt: { xs: 8, md: 8 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: { xs: "center", md: "flex-start" },
            textAlign: { xs: "center", md: "left" },
            position: "relative",
            borderRight: { md: "1px solid rgba(255,255,255,0.3)" },
            borderBottom: { xs: "1px solid rgba(255,255,255,0.3)", md: "none" }
          }}
        >
            {/* Background Blob */}
            <Box sx={{ 
                position: 'absolute', 
                top: -50, 
                left: -50, 
                width: 200, 
                height: 200, 
                borderRadius: '50%', 
                bgcolor: theme.primary,
                filter: 'blur(80px)',
                opacity: 0.3
            }} />

            {/* Back Button (Mobile Position adjusted) */}
            <Button
                startIcon={<ArrowLeft />}
                sx={{ 
                    position: 'absolute', 
                    top: { xs: 20, md: 40 }, 
                    left: { xs: 20, md: 40 },
                    color: '#333',
                    textTransform: 'none',
                    fontWeight: 600
                }}
            >
                Back
            </Button>

            <Chip 
                icon={<SeasonIcon size={16} color="white"/>}
                label="Account Recovery"
                sx={{ 
                    bgcolor: theme.primary, 
                    color: 'white', 
                    fontWeight: 700, 
                    mb: 3,
                    mt: { xs: 6, md: 0 }, // Space for back button on mobile
                    boxShadow: `0 4px 15px ${theme.primary}66`
                }}
            />

            <Typography 
                variant={isDesktop ? "h2" : "h3"} 
                sx={{ 
                    fontWeight: 800, 
                    color: "#1a1a1a", 
                    lineHeight: 1, 
                    mb: 2, 
                    zIndex: 2,
                    textShadow: "0 2px 10px rgba(255,255,255,0.5)"
                }}
            >
                Forgot<br/>
                <span style={{ color: theme.primary }}>Password?</span>
            </Typography>

            <Typography variant="body1" sx={{ color: "#333", fontWeight: 500, mt: 1, maxWidth: 300, zIndex: 2 }}>
                Don't worry, it happens to the best of us. We'll help you get back to shopping in no time.
            </Typography>
        </Box>

        {/* --- RIGHT SIDE: FORM --- */}
        <Box
          sx={{
            flex: 1.1,
            p: { xs: 4, md: 8 },
            bgcolor: "rgba(255,255,255,0.95)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minHeight: { xs: "50vh", md: "auto" }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box sx={{ p: 1, borderRadius: '12px', bgcolor: `${theme.primary}15` }}>
                <KeyRound color={theme.primary} size={24} />
            </Box>
            <Typography variant="h5" fontWeight={700} sx={{ color: '#111' }}>
                Reset Credentials
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ mb: 4, color: '#666' }}>
            Enter the email address associated with your <b>SB Grocery</b> account and we'll send you a link to reset your password.
          </Typography>

          <TextField
            fullWidth
            label="Registered Email Address"
            placeholder="you@example.com"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              endAdornment: <Mail size={18} color="#9ca3af" />,
            }}
            sx={{
              mb: 4,
              "& .MuiOutlinedInput-root": {
                borderRadius: "16px",
                bgcolor: "white",
                "& fieldset": { borderColor: "#e5e7eb" },
                "&:hover fieldset": { borderColor: theme.primary },
                "&.Mui-focused fieldset": { borderColor: theme.primary },
              },
              "& .MuiInputLabel-root.Mui-focused": { color: theme.primary }
            }}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            endIcon={<ArrowRight size={18} />}
            sx={{
              background: theme.gradient,
              color: "white",
              fontWeight: 700,
              py: 1.8,
              borderRadius: "16px",
              textTransform: 'none',
              fontSize: '1rem',
              boxShadow: `0 10px 20px -5px ${theme.primary}66`,
              "&:hover": {
                 opacity: 0.9,
                 boxShadow: `0 10px 20px -5px ${theme.primary}99`,
              }
            }}
          >
            Send Reset Link
          </Button>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Link 
                underline="hover"
                sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: 1, 
                    color: '#666', 
                    fontWeight: 600, 
                    cursor: 'pointer' 
                }}
            >
                <ArrowLeft size={16} />
                Back to Login
            </Link>
          </Box>

        </Box>

      </Card>
    </Box>
  );
}