import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from './Home';
import Stock from './Stock';
import History from './History'





function App() {
  return (
    <div className="container">
    <Router>
      <div>
        <div className="container__nav">
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                /
              </li>
              <li>
                <Link to="/stock">Stock</Link>
              </li>
            </ul>
          </nav>
        </div>


        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/stock">
            <Stock />
          </Route>
          <Route path="/history">
            <History />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
    </div>
  );
}

export default App;
