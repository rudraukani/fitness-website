import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Explore from './pages/Explore';
import Account from './pages/Account';
import ExerciseDetail from './pages/ExerciseDetail';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const App = () => {

  return (
    <div className="app-div">

      <div className="navbar-div">
        <Navbar />
      </div>

      <div className="main-div">

        <div className="page-content">
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/exercise/:id" element={<ExerciseDetail />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/account" element={<Account />} />
          </Routes>
        </div>

        <Footer />
      </div>

    </div>
  );
};


export default App;


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
