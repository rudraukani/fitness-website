import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import ExerciseDetail from './pages/ExerciseDetail';
import Account from './pages/Account';
import Favorites from './pages/Favorites';
import Explore from './pages/Explore';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

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
          <Route path="/account" element={<Account />} />

          <Route path="/" 
          element={<ProtectedRoute><Home /></ProtectedRoute>}
          />

          <Route path="/exercise/:id" element={
              <ProtectedRoute><ExerciseDetail /></ProtectedRoute>}
          />

          <Route
            path="/explore"
            element={<ProtectedRoute> <Explore /></ProtectedRoute>}
          />

          <Route
            path="/favorites" 
            element={<ProtectedRoute><Favorites /></ProtectedRoute>}
          />

          <Route
            path="/user"
            element={<ProtectedRoute> <UserAccount /> </ProtectedRoute>}
          >
            <Route index element={<AccountOverview />} />
            <Route path="routines" element={<Routines />} />
            <Route path="workoutlogs" element={<WorkoutLogs />} />
            <Route path="bodylogs" element={<BodyLogs />} />
            <Route path="progresstracker" element={<ProgressTracker />} />
          </Route>

        </Routes>
      </div>
    </div>
  );
};

export default App;
