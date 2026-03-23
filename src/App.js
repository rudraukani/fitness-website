import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Explore from './pages/Explore';
import Account from './pages/Account';
import ExerciseDetail from './pages/ExerciseDetail';
import Navbar from './components/Navbar';

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
        <Route path="/account" element={<Account />} />
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
