import "./Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar-div">
            <Link to="/">HOME</Link> 
            <Link to="/explore">EXPLORE</Link> 
            <Link to="/account">ACCOUNT</Link>
        </nav>
    );
}

export default Navbar;


/* 
import React from 'react';
import { Stack } from '@mui/material';
import { InfinitySpin } from 'react-loader-spinner';

const Loader = () => (
  <Stack direction="row" justifyContent="center" alignItems="center" width="100%">
    <InfinitySpin color="grey" />
  </Stack>
);

export default Loader;
*/