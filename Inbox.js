import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Inbox() {
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    axios.get('/api/emails')
      .then(response => setEmails(response.data))
      .catch(error => console.error('Error fetching emails:', error));
  }, []);

  return (
    <div>
      <h1>Inbox</h1>
      <ul>
        {emails.map(email => (
          <li key={email._id}>{email.subject}</li>
        ))}
      </ul>
    </div>
  );
}

export default Inbox;
