import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL, IMG_URL } from '../Urls/Urls';
import '../Styles/View-products.css';
import { Link } from 'react-router-dom';

const ProductList = ({ setCartCount }) => {
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addingToCartProductId, setAddingToCartProductId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [wishlistLoadingId, setWishlistLoadingId] = useState(null);
    const [sortOption, setSortOption] = useState('');
    const [visibleProductsCount, setVisibleProductsCount] = useState(8);
    const [alreadycart,setAlreadycart]=useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/products`, { withCredentials: true });
                let data = response.data.products;
                const userdata = response.data.user;
                setUser(userdata);
                data = data.sort(() => Math.random() - 0.5);
                setProducts(data);
            } catch (err) {
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const toggleWishlist = (event, productId) => {
        setWishlistLoadingId(productId);
        event.preventDefault();
        event.stopPropagation();
        axios.get(`${BASE_URL}/add-to-Wishlist/${productId}`, { withCredentials: true }).then((response) => {
            if (response.data.status) {
                setProducts((prevProducts) =>
                    prevProducts.map((product) =>
                        product._id === productId ? { ...product, isInWishlist: !product.isInWishlist } : product
                    )
                );
            }
            setWishlistLoadingId(null);
        });
    };

    const addToCart = (productId) => {
        setAddingToCartProductId(productId);
        axios.get(`${BASE_URL}/add-to-cart/${productId}`, { withCredentials: true })
            .then(response => {
                console.log(response)
                if (response.data.status) {
                    setCartCount(prevCount => prevCount + 1);
                }
                if (response.data.message){
                    setAlreadycart(response.data.message)
                }
            })
            .catch(error => {
                console.error('Error:', error);
            })
            .finally(() => {
                setAddingToCartProductId(null);
            });
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const sortedProducts = products
        .filter(product =>
            product.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.Category.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortOption === 'price-asc') return a.Price - b.Price;
            if (sortOption === 'price-desc') return b.Price - a.Price;
            if (sortOption === 'name-asc') return a.Name.localeCompare(b.Name);
            if (sortOption === 'name-desc') return b.Name.localeCompare(a.Name);
            return 0;
        });

    const currentProducts = sortedProducts.slice(0, visibleProductsCount);

    const loadMoreProducts = () => {
        setVisibleProductsCount(prevCount => prevCount + 8);
    };

    return (
        <section className="premium-product-section">
            <div className="container mt-3">
                <div className="search-bar mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="sort-bar mb-3">
                    <select
                        className="form-select"
                        value={sortOption}
                        onChange={handleSortChange}
                    >
                        <option value="">Sort by</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="name-asc">Name: A-Z</option>
                        <option value="name-desc">Name: Z-A</option>
                    </select>
                </div>

                {loading ? (
                    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div className="premium-loader">
                            <div className="ripple"></div>
                            <div className="ripple" style={{ animationDelay: '-1s' }}></div>
                            <div className="center-circle">
                                <div className="shine"></div>
                            </div>
                            <div className="orbital"></div>
                            <div className="orbital"></div>
                            <div className="orbital"></div>
                        </div>
                    </div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <>
                        <div className="row">
                            {currentProducts.length > 0 ? (
                                currentProducts.map((product) => (
                                    <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={product._id}>
                                        <div className="product-card">
                                            {user && (
                                                <div className="wishlist-btn">
                                                    {wishlistLoadingId === product._id ? (
                                                        <div className="wishlist-heart">
                                                            <div className="heart-container">
                                                                <div className="heart-outline"></div>
                                                                <div className="heart-fill"></div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            className={`wishlist-heart ${product.isInWishlist ? 'active' : ''}`}
                                                            onClick={(event) => toggleWishlist(event, product._id)}
                                                        >
                                                            <i className={`fas fa-heart ${product.isInWishlist ? 'text-danger' : 'text-muted'}`}></i>
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                            <div className="product-image-container">
                                                <img
                                                    className="product-image"
                                                    src={`${IMG_URL}/public/product-images/${product._id}.jpg`}
                                                    alt={product.Name}
                                                />
                                                {product.Quantity < 1 ? (
                                                    <div className="badge out-of-stock">Out of Stock</div>
                                                ) : product.Quantity < 5 ? (
                                                    <div className="badge low-stock">Only {product.Quantity} left!</div>
                                                ) : null}
                                            </div>

                                            <div className="product-info">
                                                <span className="product-category">{product.Category}</span>
                                                <h5 className="product-title">{product.Name}</h5>
                                                <p className="product-description">{product.Description}</p>

                                                <div className="price-cart">
                                                    <span className="price">₹{product.Price}</span>
                                                    {product.Quantity > 0 ? (
                                                        user ? ( 
                                                            <button style={{display:'flex',justifyContent:'center',alignItems:'center'}}
                                                                className="btn add-to-cart-btn"
                                                                onClick={() => addToCart(product._id)}
                                                            >
                                                                {addingToCartProductId === product._id ? (
                                                                   <div style={{ borderLeftColor: 'white'}} className="spinner"></div>
                                                                ) : (
                                                                    alreadycart? (
                                                                    alreadycartproduct === product._id?(
                                                                    <i className="fas fa-shopping-cart"> {alreadycart}</i>
                                                                    ) :  ):(
                                                                     <i className="fas fa-shopping-cart"> Add to cart</i>
                                                                        )
                                                                    
                                                                    
                                                                )}
                                                            </button>
                                                        ) : (
                                                            <Link to={'/login'}>
                                                                <button className="btn add-to-cart-btn">
                                                                    <i className="fas fa-shopping-cart"></i> Add to Cart
                                                                </button>
                                                            </Link>
                                                        )
                                                    ) : (
                                                        <button className="btn out-of-stock-btn" disabled>
                                                            <i className="fas fa-times"></i> Out of Stock
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-products">No products found</div>
                            )}
                        </div>

                        {visibleProductsCount < sortedProducts.length && (
                            <div className="load-more-container text-center">
                                <button className="btn btn-load-more" onClick={loadMoreProducts}>
                                    Load More Products
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default ProductList;
