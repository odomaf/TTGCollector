import React from 'react';
import './App.css';

//components
import { AddGame } from './components/AddGame';

function App() {
  return (
    <div className="App">
      <h1>Welcome to TTG Collector</h1>
      <AddGame />
    </div>
  );
}

export default App;
