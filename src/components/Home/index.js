import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

const HomePage = () => (
  <div>
    <h1>Home Page</h1>
    <p>Landing and home page</p>

    <Link to={ROUTES.SIGN_UP}>CREATE ACCOUNT</Link>

  </div>
);

export default HomePage;