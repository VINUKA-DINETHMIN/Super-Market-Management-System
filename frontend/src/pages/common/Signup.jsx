import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import { Grid, Paper } from "@mui/material";
import { toast } from 'react-toastify';
import axios from 'axios';
import { apiUrl } from '../../utils/Constants';

const Signup = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const payload = {
            email: data.get('email'),
            password: data.get('password').toString(), // convert password to string data type
            contactNo: data.get('contactNo'),
            firstName: data.get('firstName'),
            lastName: data.get('lastName'),
            role: 'customer',
        };

        // Validation
        const validationErrors = {};
        if (!payload.firstName.trim()) {
            validationErrors.firstName = "First Name is required";
        }
        if (!payload.lastName.trim()) {
            validationErrors.lastName = "Last Name is required";
        }
        if (!payload.contactNo.trim()) {
            validationErrors.contactNo = "Phone is required";
        } else if (!/^\d{10}$/.test(payload.contactNo.trim())) {
            validationErrors.contactNo = "Phone number should have 10 digits";
        }
        if (!payload.email.trim()) {
            validationErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(payload.email)) {
            validationErrors.email = "Email is invalid";
        }
        if (!payload.password.trim()) {
            validationErrors.password = "Password is required";
        } else if (payload.password.trim().length < 8) {
            validationErrors.password = "Password must be at least 8 characters long.";
        } else if (
            !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(payload.password.trim())
        ) {
            validationErrors.password = "Password must contain at least one uppercase letter, numeric & special character";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const isLoggedin = await axios.post(`${apiUrl}/user/create`, payload);
            if (isLoggedin) {
                toast.success('Account Creation Successful!')
                navigate('/login');
            }
        } catch (error) {
            if (error.message) {
                toast.error(error.message);
            }
            toast.error(error.response.data.message);
        }
    };

    return (
        <Container component="main" maxWidth={'1000px'} style={{backgroundImage: 'url("https://img.freepik.com/free-vector/geometric-gradient-futuristic-background_23-2149116406.jpg?size=626&ext=jpg")', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', minHeight: '100vh'}}>
            <Box
                sx={{
                    marginTop: 5,
                }}
            >
                <Grid container >
                    <Grid
                        item
                        xs={12}
                        sm={8}
                        md={5}
                        mx={'auto'}
                        component={Paper}
                        elevation={6}
                        square

                        style={{marginTop:55, backgroundColor: 'white', opacity: 0.9}}
                    >
                        <Box
                            sx={{
                                my: 8,
                                mx: 4,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <Typography component="h1" variant="h4">
                                Sign up
                            </Typography>
                            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            autoComplete="given-name"
                                            name="firstName"
                                            required
                                            fullWidth
                                            id="firstName"
                                            label="First Name"
                                            autoFocus
                                            error={!!errors.firstName}
                                            helperText={errors.firstName}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="lastName"
                                            label="Last Name"
                                            name="lastName"
                                            autoComplete="family-name"
                                            error={!!errors.lastName}
                                            helperText={errors.lastName}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            name="contactNo"
                                            required
                                            fullWidth
                                            id="contactNo"
                                            label="Phone"
                                            error={!!errors.contactNo}
                                            helperText={errors.contactNo}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="email"
                                            label="Email Address"
                                            name="email"
                                            autoComplete="email"
                                            error={!!errors.email}
                                            helperText={errors.email}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="password"
                                            label="Password"
                                            type="password"
                                            id="password"
                                            autoComplete="new-password"
                                            error={!!errors.password}
                                            helperText={errors.password}
                                        />
                                    </Grid>
                                </Grid>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Sign Up
                                </Button>
                                <Grid container justifyContent="flex-end"
                                    sx={{ mb: 2 }}>
                                    <Grid item>
                                        <Link
                                            component="button"
                                            variant="body2"
                                            onClick={() => {
                                                navigate('/login');
                                            }}>
                                            {"Already have an account? Sign in"}
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default Signup;
