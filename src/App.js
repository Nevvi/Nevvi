import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

const App = () => {
  return (
    <Router>
        <Route path="/" component={Home} />
    </Router>
  );
};

const Home = () => {
  return (
    <div>
        <p>Environment - {process.env.REACT_APP_ENVIRONMENT}</p>
    </div>
  )
}

export default App;