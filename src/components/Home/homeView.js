import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

const HomeView = ({ launchDemo, signUpRoute }) => (
  <div className="homeView">
    <div className="content">
      <div>
        <h1>Home Page</h1>
        <Link to={signUpRoute}>CREATE ACCOUNT</Link>
        <h3 onClick={() => launchDemo()}>TRY IT</h3>
      </div>
      <div></div>
      <div></div>
    </div>
  </div>
);

export default HomeView;