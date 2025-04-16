import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Campaigns from './components/Campaigns';
import Compose from './components/Compose';
import CRM from './components/CRM';
import Inbox from './components/Inbox';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Switch>
          <Route path="/inbox" component={Inbox} />
          <Route path="/compose" component={Compose} />
          <Route path="/campaigns" component={Campaigns} />
          <Route path="/crm" component={CRM} />
          <Route path="/" component={Inbox} /> {/* Default route */}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
