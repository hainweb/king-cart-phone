import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../Urls/Urls';
import { User, Lock } from 'lucide-react';
import './Login.css';  // Import the CSS file

const Login = ({ setUser, setCartCount }) => { // Receive setCartCount prop
  const [loading, setLoading] = useState(false) 
  const [formData, setFormData] = useState({
    Mobile: '',
    Password: '',
  });
  const [loginErr, setLoginErr] = useState('');

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  // Track mouse position for dynamic background
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



  const handleSubmit = (e) => {
    setLoading(true)
    e.preventDefault();
    axios.post(`${BASE_URL}/login`, formData, { withCredentials: true }).then((response) => {
      if (response.data.loggedIn) {
        setUser(response.data.user); // Update user state

        // Fetch the updated cart count after login
        axios.get(`${BASE_URL}/products`, { withCredentials: true })
          .then((cartResponse) => {
            setCartCount(cartResponse.data.cartCount); // Update cart count state
          })
          .catch((error) => console.error('Error fetching cart count:', error));
 
        navigate('/');
        setLoading(false)
      } else {
        setLoading(false)
        setLoginErr(response.data.message || 'Invalid mobile or password');
      }
    });
  };

  return (
    <div className="login-container">
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
      <div className="login-box">
        <div className="box-content">
          <div className="text-center">
            <h2 className="title">Login</h2>
            <p className="subtitle">Access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <User className="input-icon" />
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

            {loginErr && <p style={{ color: 'red' }}>{loginErr}</p>}


            <Link to="/signup">
              <h5 className="signup-link">Don't have an account? Sign up</h5>
            </Link>

            <button type="submit" className="submit-button"> 
              {loading? 
             <div className="loading-spinner">
                    
             <div className="spinner-segment"></div>
             <div className="spinner-segment"></div>
             <div className="spinner-segment"></div>
           </div> 
             
            
            : Login } Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
