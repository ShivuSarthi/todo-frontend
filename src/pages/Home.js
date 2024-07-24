import React from "react";
import { Link } from "react-router-dom";
import { Container, Typography, Button } from "@mui/material";

const Home = () => {
  return (
    <Container>
      <Typography variant="h2" align="center" gutterBottom>
        Task Manager
      </Typography>
      <Button
        component={Link}
        to="/register"
        variant="contained"
        color="primary"
      >
        Register
      </Button>
      <Button component={Link} to="/login" variant="contained" color="primary">
        Login
      </Button>
    </Container>
  );
};

export default Home;
