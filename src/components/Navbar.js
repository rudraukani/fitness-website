import "./Navbar.css";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import FavoriteIcon from "@mui/icons-material/Favorite";

function Navbar() {
  return (
    <nav className="navbar-div">
      <Link to="/"><HomeIcon sx={{ fontSize: "1.6rem" }} />HOME</Link>
      <Link to="/explore"><SearchIcon sx={{ fontSize: "1.6rem" }} />EXPLORE</Link>
      <Link to="/favorites"><FavoriteIcon sx={{ fontSize: "1.6rem" }} />FAVORITES</Link>
      <Link to="/account"><AccountBoxIcon sx={{ fontSize: "1.6rem" }} />ACCOUNT</Link>
    </nav>
  );
}

export default Navbar;
