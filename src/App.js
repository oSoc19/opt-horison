import React from 'react';
import './App.css';
import CustomMap from './components/CustomMap';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className="container">
      <Sidebar></Sidebar>
      <CustomMap>
      </CustomMap>
    </div>
  );
}

export default App;
