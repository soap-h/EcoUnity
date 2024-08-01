import React from 'react';
import { Box, Typography, TextField, Button, Avatar} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register({ onClose, setOpenLogin }) {
    const navigate = useNavigate();
  
    const formik = useFormik({
      initialValues: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      validationSchema: yup.object({
        firstName: yup
          .string()
          .trim()
          .min(3, "Name must be at least 3 characters")
          .max(50, "Name must be at most 50 characters")
          .required("Name is required")
          .matches(
            /^[a-zA-Z '-,.]+$/,
            "Name only allows letters, spaces and characters: ' - , ."
          ),
        lastName: yup
          .string()
          .trim()
          .min(3, "Name must be at least 3 characters")
          .max(50, "Name must be at most 50 characters")
          .required("Name is required")
          .matches(
            /^[a-zA-Z '-,.]+$/,
            "Name only allows letters, spaces and characters: ' - , ."
          ),
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
          .required("Password is required")
          .matches(
            /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
            "Password must have at least 1 letter and 1 number"
          ),
        confirmPassword: yup
          .string()
          .trim()
          .required("Confirm password is required")
          .oneOf([yup.ref("password")], "Passwords must match"),
      }),
      onSubmit: (data) => {
        data.firstName = data.firstName.trim();
        data.lastName = data.lastName.trim();
        data.email = data.email.trim().toLowerCase();
        data.password = data.password.trim();
        http
          .post("/user/register", data)
          .then((res) => {
            console.log(res.data);
            setOpenLogin(true); // Open login popup after successful registration
            onClose(); // Close the registration dialog
          })
          .catch((err) => {
            toast.error(`${err.response.data.message}`);
          });
      },
    });
  
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
          Register
        </Typography>
        <Box component="form" sx={{ maxWidth: "500px" }} onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            margin="dense"
            autoComplete="off"
            label="First Name"
            name="firstName"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
          />
          <TextField
            fullWidth
            margin="dense"
            autoComplete="off"
            label="Last Name"
            name="lastName"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
          />
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
          <TextField
            fullWidth
            margin="dense"
            autoComplete="off"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
          />
          <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
            Register
          </Button>
        </Box>
        <ToastContainer />
      </Box>
    );
  }
  
  export default Register;
