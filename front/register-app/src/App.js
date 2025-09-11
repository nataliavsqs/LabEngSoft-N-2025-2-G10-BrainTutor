import React from 'react';
import {
  Routes,
  Route,
  Link
} from 'react-router-dom';
import LoginForm from './components/LoginForm';

function Home() {
  return ( <
    div >
    <
    h1 > Bem - vindo ao Brain Tutor < /h1> <
    Link to = "/login" > Ir para Login < /Link> <
    /div>
  );
}

function App() {
  return ( <
    Routes >
    <
    Route path = "/"
    element = {
      < Home / >
    }
    /> <
    Route path = "/login"
    element = {
      < LoginForm / >
    }
    /> <
    /Routes>
  );
}

export default App;