import axios from 'axios';
import React, { useState } from 'react';

function Compose() {
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    text: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/send-email', formData);
      alert('Email sent successfully');
    } catch (error) {
      const msg = error?.response?.data?.error || error?.message || 'Unknown error';
      alert('Error sending email: ' + msg);
    }
  };

  return (
    <div>
      <h1>Compose Email</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>To:</label>
          <input type="email" name="to" value={formData.to} onChange={handleChange} required />
        </div>
        <div>
          <label>Subject:</label>
          <input type="text" name="subject" value={formData.subject} onChange={handleChange} required />
        </div>
        <div>
          <label>Text:</label>
          <textarea name="text" value={formData.text} onChange={handleChange} required />
        </div>
        <button type="submit">Send Email</button>
      </form>
    </div>
  );
}
export default Compose;
