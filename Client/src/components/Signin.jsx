import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Signin = ({ setUser }) => {
  const [formData, setFormData] = useState({ user_id: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('/api/signin', formData, { withCredentials: true });
      if (response.data.success) {
        setUser(response.data.user);
        navigate('/home');
      } else {
        setError(response.data.message || 'Signin failed.');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSignin}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          <label>User ID:</label>
          <input
            type="text"
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            placeholder="User ID"
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
        </div>
        <button type="submit">Sign In</button>
      </form>
      <p>
        Don't have an account?{' '}
        <button onClick={() => navigate('/signup')}>Sign Up</button>

      </p>
    </div>
  );
};

Signin.propTypes = {
  setUser: PropTypes.func.isRequired,
};

export default Signin;