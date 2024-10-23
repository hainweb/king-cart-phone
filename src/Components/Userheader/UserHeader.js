import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing
import './UserHeader.css';

function UserHeader({ cartCount, user }) {
  return (
    <header className="premium-header">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        {/* Brand/logo */}
        <Link className="navbar-brand premium-brand" to="/">King Cart</Link>

        {/* Left-aligned items (Cart and Orders) */}
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            
            <Link className="nav-link" to="/cart">
              <i className="fas fa-shopping-cart"></i> 
              Cart {user? <span className="premium-badge">{cartCount}</span> : ''}
            </Link>
          </li>

          {user && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/orders">Orders</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/wishlist">Wishlist</Link>
              </li>
            </>
          )}
        </ul>

        {/* Right-aligned user information and login/logout */}
        <div className="loginbutton-container">
          {user ? (
            <Link to="/logout">
              <button className="loginbutton">{user.Name} / Log Out</button>
            </Link>
          ) : (
            <Link to="/login">
              <button className="loginbutton">Login / Sign Up</button>
            </Link>
          )}
        </div>
      </nav>

      {/* Bottom navigation for mobile view */}
      <nav className="bottom-nav">
        <ul className="bottom-nav-list">

        <li>
           
           <Link className="bottom-nav-item active" to="/">
           <i class="fa-solid fa-house"></i>
           Home 
         </Link>
        
       </li>
          <li>
           
              <Link className="bottom-nav-item " to="/cart">
              <i className="fas fa-shopping-cart"><span className="premium-badge">{cartCount}</span></i>
              Cart 
            </Link>
           
          </li>
          <li>
           
            <Link className="bottom-nav-item" to="/orders">
            <i className="fas fa-box"></i>
            <span>Orders</span>
            </Link>
          </li>
          <li>
            <Link to="/wishlist" className="bottom-nav-item">
              <i className="fas fa-heart"></i>
              <span>Wishlist</span>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default UserHeader;
