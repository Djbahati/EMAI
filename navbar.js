import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul>
        <li><Link to="/inbox">Inbox</Link></li>
        <li><Link to="/compose">Compose</Link></li>
        <li><Link to="/campaigns">Campaigns</Link></li>
        <li><Link to="/crm">CRM</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
