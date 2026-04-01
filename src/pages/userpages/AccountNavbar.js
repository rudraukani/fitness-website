import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import "./AccountNavbar.css";

function AccountNavbar() {
  
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/account", { replace: true });
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <nav className="acc-navbar-div">
      <Link to="/user">OVERVIEW</Link>
      <Link to="/user/routines">ROUTINES</Link>
      <Link to="/user/workoutlogs">WORKOUT LOGS</Link>
      <Link to="/user/bodylogs">BODY METRICS LOG</Link>
      <Link to="/user/progresstracker">PROGRESS TRACKER</Link>
      <button onClick={handleLogout} className="signout-btn">SIGN OUT</button>
    </nav>
  );
}

export default AccountNavbar;
