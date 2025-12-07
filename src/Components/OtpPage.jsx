import React, { useState } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  TextField,
  Grid,
  Link,
  useMediaQuery,
  useTheme,
  Chip,
} from "@mui/material";
import {
  ArrowRight,
  Snowflake,
  Sun,
  Flower2,
  CloudRain,
  ShieldCheck,
  ArrowLeft,
  Smartphone,
  Timer
} from "lucide-react";

// --- SEASONAL CONFIGURATION ---
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

export default function OtpPage() {
  // 6-Digit State
  const [otp, setOtp] = useState(new Array(6).fill(""));
  
  const muiTheme = useTheme();
  const isDesktop = useMediaQuery(muiTheme.breakpoints.up("md"));

  const currentSeasonKey = getSeason();
  const theme = SEASON_CONFIG[currentSeasonKey];
  const SeasonIcon = theme.icon;

  // --- OTP LOGIC (Handle Change & Next Focus) ---
  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next box if value exists and not last box
      if (value && index < 5) { 
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  // --- OTP LOGIC (Handle Backspace) ---
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "") {
        // If empty, go to previous and clear it
        if (index > 0) {
          const prevId = `otp-${index - 1}`;
          document.getElementById(prevId).focus();
          const newOtp = [...otp];
          newOtp[index - 1] = "";
          setOtp(newOtp);
        }
      } else {
        // If not empty, clear current
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  // --- OTP LOGIC (Handle Paste) ---
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6); // Get first 6 chars
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.split("");
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (i < 6) newOtp[i] = digit;
      });
      setOtp(newOtp);
      
      // Focus the box after the last pasted digit
      const nextIndex = Math.min(digits.length, 5);
      document.getElementById(`otp-${nextIndex}`).focus();
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
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
          borderRadius: { xs: "0px", md: "30px" },
          background: "rgba(255, 255, 255, 0.8)", 
          backdropFilter: "blur(20px)",
          border: { xs: "none", md: "1px solid rgba(255, 255, 255, 0.5)" },
          boxShadow: { xs: "none", md: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" },
          overflow: { xs: "auto", md: "hidden" },
        }}
      >
        
        {/* --- LEFT SIDE: CONTEXT --- */}
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
                icon={<ShieldCheck size={16} color="white"/>}
                label="Security Verification"
                sx={{ 
                    bgcolor: theme.primary, 
                    color: 'white', 
                    fontWeight: 700, 
                    mb: 3,
                    mt: { xs: 6, md: 0 },
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
                Verify<br/>
                <span style={{ color: theme.primary }}>Your Account</span>
            </Typography>

            <Typography variant="body1" sx={{ color: "#333", fontWeight: 500, mt: 1, maxWidth: 300, zIndex: 2 }}>
                Enter the 6-digit code sent to your email to confirm your identity.
            </Typography>
        </Box>

        {/* --- RIGHT SIDE: FORM --- */}
        <Box
          sx={{
            flex: 1.1,
            p: { xs: 3, md: 8 },
            bgcolor: "rgba(255,255,255,0.95)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minHeight: { xs: "50vh", md: "auto" }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
            <Box sx={{ p: 1, borderRadius: '12px', bgcolor: `${theme.primary}15` }}>
                <Smartphone color={theme.primary} size={24} />
            </Box>
            <Typography variant="h5" fontWeight={700} sx={{ color: '#111' }}>
                Enter 6-Digit Code
            </Typography>
          </Box>

          {/* 6-DIGIT INPUT GRID */}
          <Grid 
            container 
            spacing={0.5} // Very tight spacing for Mobile fit
            justifyContent="center"
            sx={{ mb: 4 }}
          >
            {otp.map((digit, index) => (
              <Grid item key={index}>
                <TextField
                  id={`otp-${index}`}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste} // Paste Listener
                  inputProps={{
                    maxLength: 1,
                    style: {
                      textAlign: "center",
                      fontSize: "18px",
                      fontWeight: "bold",
                      padding: "12px 0",
                    },
                  }}
                  sx={{
                    // Optimized sizes for 6 digits on small screens
                    width: { xs: "40px", sm: "48px", md: "52px" },
                    mx: { xs: 0.2, sm: 0.5 }, // Small horizontal margin
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "white",
                      borderRadius: "12px",
                      "& fieldset": { borderColor: "#e5e7eb", borderWidth: "2px" },
                      "&:hover fieldset": { borderColor: theme.primary },
                      "&.Mui-focused fieldset": { borderColor: theme.primary },
                    },
                  }}
                />
              </Grid>
            ))}
          </Grid>

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
            Verify Code
          </Button>

          <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="#666">
                Didn't receive the code?
            </Typography>
            <Link 
                underline="hover"
                sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    color: theme.primary, 
                    fontWeight: 700, 
                    cursor: 'pointer' 
                }}
            >
                <Timer size={16} />
                Resend in 30s
            </Link>
          </Box>

        </Box>

      </Card>
    </Box>
  );
}