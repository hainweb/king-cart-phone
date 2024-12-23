import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../Urls/Urls';
import { User, Lock, Phone, ShoppingCart } from 'lucide-react';
import './Signup.css';  // Import the CSS file

const Signup = ({ setUser }) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    Name: '',
    Mobile: '',
    Password: '',
  });
  const [info, setInfo] = useState('');

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    // Validate Name (non-empty)
    if (!formData.Name.trim()) {
      setInfo('Name is required');
      return false;
    }

    // Validate Mobile (must be exactly 10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.Mobile)) {
      setInfo('Mobile must be 10 digits');
      return false;
    }

    // Validate Password (must be at least 4 characters)
    if (formData.Password.length < 4) {
      setInfo('Password must be at least 4 characters');
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e) => {
    setLoading(true)
    e.preventDefault();

    if (!validateForm()) {
      setLoading(false)
      return;
    }
     
    axios.post(`${BASE_URL}/signup`, formData, { withCredentials: true }).then((response) => {
      if (response.data.status) {
        const userData = { response data.user };
        setUser(userData);
        navigate('/');
        setLoading(false)
      } else {
        setInfo('This number is already taken');
        setLoading(false)
        navigate('/signup');
       
      }
    });
  };

  return (
    <div className="signup-container">
      {/* Dynamic Background */}
      <div className="background">
        {/* Gradient Orb */}
        <div
          className="gradient-orb"
          style={{
            transform: `translate(${mousePosition.x / 10}px, ${mousePosition.y / 10}px)`,
          }}
        />

        {/* Grid Background */}
        <div className="grid-background" />

        {/* Floating Elements */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="floating-element"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
              animationDelay: `${Math.random() * -10}s`,
            }}
          />
        ))}
      </div>

      {/* Main Container */}
      <div className="signup-box">
        <div className="box-content">
          <div className="text-center">
            <div className="icon-container">
              <ShoppingCart className={`icon  ? 'animate-icon' : ''}`} />
            </div>
            <h2 className="title">Sign Up</h2>
            <p className="subtitle">Create an account with us</p>
          </div>

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="input-group">
              <User className="input-icon" />
              <input
                className="input-field"
                type="text"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                placeholder="Full Name"
              />
            </div>

            <div className="input-group">
              <Phone className="input-icon" />
              <input
                className="input-field"
                type="number"
                name="Mobile"
                value={formData.Mobile}
                onChange={handleChange}
                placeholder="Mobile"
              />
            </div>

            <div className="input-group">
              <Lock className="input-icon" />
              <input
                className="input-field"
                type="password"
                name="Password"
                value={formData.Password}
                onChange={handleChange}
                placeholder="Password"
              />
            </div>

            <p className="error-message">{info}</p>

            <Link to="/login">
              <h5 className="login-link">Already have an account?</h5>
            </Link>

            <button type="submit" className="submit-button">
              {loading ?
                <div className="load-3">
                  <div className="line"></div>
                  <div className="line"></div>
                  <div className="line"></div>
                </div>
              :  "Sign Up"}

            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
