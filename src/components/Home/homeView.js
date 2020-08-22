import React from 'react';
import { Link } from 'react-router-dom';

const HomeView = ({ launchDemo, signUpRoute }) => (
  <div>
    <h1>Home Page</h1>
    <Link to={signUpRoute}>CREATE ACCOUNT</Link>
    <h3 onClick={() => launchDemo()}>TRY IT</h3>
  </div>
);

export default HomeView;