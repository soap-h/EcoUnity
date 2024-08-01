
import React, { useState, useContext } from "react";
import { Box, Typography, TextField, Button, Avatar } from "@mui/material";
import UserContext from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../http";
import WelcomePopup from "./WelcomePopup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login({ onClose }) {
  const [showPopup, setShowPopup] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .trim()
        .email("Enter a valid email")
        .max(50, "Email must be at most 50 characters")
        .required("Email is required"),
      password: yup
        .string()
        .trim()
        .min(8, "Password must be at least 8 characters")
        .max(50, "Password must be at most 50 characters")
        .required("Password is required"),
    }),
    onSubmit: (data) => {
      data.email = data.email.trim().toLowerCase();
      data.password = data.password.trim();
      console.log(data);
      http
        .post("/user/login", data)
        .then((res) => {
          const user = res.data.user;
          setUserName(user.firstName);
          localStorage.setItem("accessToken", res.data.accessToken);
          setUser(res.data.user);
          setShowPopup(true);
        })
        .catch((err) => {
          toast.error(`${err.response.data.message}`);
        });
    },
  });

  const handleClosePopup = () => {
    setShowPopup(false);
    onClose(); // Close the login dialog
    if (user.isAdmin) {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  return (
    <Box
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 2,
      }}
    >
      <Avatar
        alt="Eco Unity Logo"
        src="/src/assets/logo.svg"
        sx={{ width: 80, height: 80, mb: 2 }}
      />
      <Typography variant="h5" sx={{ my: 2 }}>
        Login
      </Typography>
      <Box
        component="form"
        sx={{ maxWidth: "500px" }}
        onSubmit={formik.handleSubmit}
      >
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Password"
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
          Login
        </Button>
      </Box>
      {showPopup && (
        <WelcomePopup userName={userName} onClose={handleClosePopup} />
      )}
      <ToastContainer />
    </Box>
  );
}

export default Login;
