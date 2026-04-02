import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import ExerciseDetail from './pages/ExerciseDetail';
import Account from './pages/Account';
import Navbar from './components/Navbar';
<<<<<<< Updated upstream
import Favorites from './pages/Favorites';
import UserAccount from './pages/userpages/UserAccount';

import AccountOverview from './pages/userpages/AccountOverview';
import Routines from './pages/userpages/Routines';
import WorkoutLogs from './pages/userpages/WorkoutLogs';
import BodyLogs from './pages/userpages/BodyLogs';
import ProgressTracker from './pages/userpages/ProgressTracker';

const App = () => {
  return (
    <div className="app-div">
      <div className="navbar-div">
        <Navbar />
      </div>

      <div className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/exercise/:id" element={<ExerciseDetail />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/account" element={<Account />} />

          <Route path="/user" element={<UserAccount />}>
            <Route index element={<AccountOverview />} />
            <Route path="routines" element={<Routines />}/>
            <Route path="workoutlogs" element={<WorkoutLogs />}/>
            <Route path="bodylogs" element={<BodyLogs />}/>
            <Route path="progresstracker" element={<ProgressTracker />}/>
          </Route>
        </Routes>
      </div>

    </div>
  );
};

export default App;

// Photo by <a href="https://unsplash.com/@weareambitious?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Ambitious Studio* | Rick Barrett</a> on <a href="https://unsplash.com/photos/a-gym-filled-with-lots-of-machines-and-weights-1RNQ11ZODJM?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
      
// OLD CODE 
  // return ( 
  //   <>
  //     <Navbar />
  //     <Routes>
  //       <Route path="/" element={<Home />} />
  //       <Route path="/exercise/:id" element={<ExerciseDetail />} />
  //       <Route path="/explore" element={<Explore />} />
  //       {/* <Route path="/account" element={<Account />} /> */}
  //     </Routes>
  //     <Footer />
  //   </>
  // ); 
=======
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/account" element={<Account />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exercise/:id"
          element={
            <ProtectedRoute>
              <ExerciseDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
>>>>>>> Stashed changes
