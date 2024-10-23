import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL, IMG_URL } from '../Urls/Urls';

const Wishlist = ({ setCartCount }) => {
    const [loading, setLoading] = useState(true);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [wishRemove, setWishRemove] = useState({});

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const wishData = await axios.get(`${BASE_URL}/wishlist`, { withCredentials: true });
                setWishlistItems(wishData.data.wishlistItems);
            } catch (error) {
                console.error('Error fetching wishlist:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchWishlist();
    }, []);

    const toggleWishlist = (event, productId) => {
        event.preventDefault();
        event.stopPropagation();

        setWishRemove(prev => ({ ...prev, [productId]: true }));

        axios.get(`${BASE_URL}/add-to-Wishlist/${productId}`, { withCredentials: true })
            .then((response) => {
                if (response.data.status) {
                    setWishlistItems(prevItems =>
                        prevItems.filter(item => item.product._id !== productId)
                    );
                }
            })
            .catch((error) => {
                console.error('Error removing from wishlist:', error);
            })
            .finally(() => {
                setWishRemove(prev => ({ ...prev, [productId]: false }));
            });
    };

    const styles = {
        section: {
            padding: '2rem 0',
            backgroundColor: '#f8f9fa',
        },
        title: {
            textAlign: 'center',
            fontSize: '2rem',
            marginBottom: '1.5rem',
        },
        loadingSpinner: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        spinnerSegment: {
            width: '10px',
            height: '10px',
            margin: '0 5px',
            borderRadius: '50%',
            backgroundColor: '#007bff',
            animation: 'spinner-animation 1s infinite',
        },
        card: {
            border: 'none',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s',
        },
        cardHover: {
            transform: 'translateY(-5px)',
        },
        removeBtn: {
            width: '35px',
            height: '35px',
            position: 'absolute',
            top: '10px',
            right: '10px',
            borderRadius: '50%',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            opacity: 0.9,
            transition: 'background-color 0.3s ease',
        },
        removeBtnHover: {
            backgroundColor: '#c82333',
        },
        img: {
            height: '11rem',
            objectFit: 'cover',
        },
        cardTitle: {
            fontSize: '1.25rem',
            fontWeight: 'bold',
        },
        cardText: {
            margin: '0.5rem 0',
        },
        outOfStock: {
            color: '#dc3545',
        },
        lowStock: {
            color: '#ffc107',
        },
        emptyMessage: {
            textAlign: 'center',
            fontSize: '1.2rem',
            color: '#6c757d',
        },
    };

    return (
        <section style={styles.section}>
            <div className="container con">
                <h2 style={styles.title}>Wishlist</h2>
                {loading ? (
                    <div style={styles.loadingSpinner}>
                        <div style={styles.spinnerSegment}></div>
                        <div style={styles.spinnerSegment}></div>
                        <div style={styles.spinnerSegment}></div>
                    </div>
                ) : (
                    wishlistItems.length > 0 ? (
                        <div className="row">
                            {wishlistItems.map((item) => (
                                <div className="col-md-3 p-3" key={item.product._id}>
                                    <div
                                        className="card"
                                        style={styles.card}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = styles.cardHover.transform}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = ''}
                                    >
                                        <button
                                            style={styles.removeBtn}
                                            onClick={(event) => toggleWishlist(event, item.product._id)}
                                        >
                                            {wishRemove[item.product._id] ? <div className="spinner"></div> : 'X'}
                                        </button>
                                        <img
                                            style={styles.img}
                                            src={`${IMG_URL}/public/product-images/${item.product._id}.jpg`}
                                            alt="Product"
                                        />
                                        <div className="card-body">
                                            <h5 style={styles.cardTitle}>{item.product.Name}</h5>
                                            <p style={styles.cardText}>Rs: {item.product.Price}</p>
                                            <p style={styles.cardText}>{item.product.Category}</p>
                                            <p style={styles.cardText}>{item.product.Description}</p>
                                            {item.product.Quantity < 1 ? (
                                                <p style={styles.outOfStock}>Stock out</p>
                                            ) : item.product.Quantity < 5 ? (
                                                <p style={styles.lowStock}>Only {item.product.Quantity} left!</p>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={styles.emptyMessage}>Your wishlist is empty!</p>
                    )
                )}
            </div>
        </section>
    );
};

export default Wishlist;
