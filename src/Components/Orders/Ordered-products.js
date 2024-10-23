import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL, IMG_URL } from '../Urls/Urls';
import { useParams } from 'react-router-dom';

const OrderTracking = ({ orderTrack }) => {
   

    return (
        <div className="container con">
            <div className="row">
                <h5>Ordered Products</h5>
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-md-10 hh-grayBox pt45 pb20">
                            <div className="row justify-content-between">
                                {orderTrack.map((track, index) => (
                                    <React.Fragment key={index}>
                                        <div className={`order-tracking ${track.status ? 'completed' : ''}`}>
                                            <span className="is-complete"></span>
                                            <p>Ordered<br /><span>{track.date}</span></p>
                                        </div>

                                        <div className={`order-tracking ${track.status2 ? 'completed' : ''}`}>
                                            <span className="is-complete"></span>
                                            <p>Shipped</p>
                                            {track.status2 && (
                                                <p>Your product is shipped at {track.shipedDate}</p>
                                            )}
                                        </div>

                                        <div className={`order-tracking ${track.status3 ? 'completed' : ''}`}>
                                            <span className="is-complete"></span>
                                            <p>Delivered</p>
                                            {track.status3 && (
                                                <p>Your product was delivered at <span>{track.deliveredDate}</span></p>
                                            )}
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProductCard = ({ products }) => {
    return (
        <div className="container">
            <div className="row">
                {products ? products.map((product, index) => (
                    <div className="col-md-3 " key={index}>
                        <div className="card" style={{ width: '15rem', height: '20rem' }}>
                            <img
                                className="card-img-top"
                                src={`${IMG_URL}/public/product-images/${product.item}.jpg`}
                                alt="Product"
                                style={{ height: '15rem' }}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{product.Name}</h5>
                                <p className="card-text">{product.Category}</p>
                                <p className="card-text">Rs: {product.Price}</p>
                                <p className="card-text">Quantity: {product.quantity}</p>
                            </div>
                        </div>
                    </div>
                )) : ''}

            </div>
        </div>
    );
};

const OrderPage = () => {
    const { Id } = useParams(); // Get the order Id from the URL
    const [orderTrack, setOrderTrack] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/view-orders-products/${Id}`, {
                    withCredentials: true, // Ensure cookies are sent if necessary
                });
                console.log('Products:', response.data);
                console.log('Order Track:', response.data.ordertrack);

                setProducts(response.data.products); // Set products state
                setOrderTrack(response.data.ordertrack); // Set order tracking state
                setLoading(false); // Disable loading after fetching data
                console.log('data products', products);

            } catch (error) {
                console.error('Error fetching order details:', error);
                setLoading(false); // Disable loading in case of error
            }
        };

        fetchOrderDetails();
    }); // Re-run when the Id changes

    if (loading) {
        return <div className="con">
         <div className="loading-spinner">
        <div className="spinner-segment"></div>
        <div className="spinner-segment"></div>
        <div className="spinner-segment"></div>
        </div>
        </div>
  
   ; // Show a loading indicator
    }

    return (
        <section>
                <OrderTracking orderTrack={orderTrack} />  {/* Display Order Tracking */}
            <ProductCard products={products} />         {/* Display Ordered Products */}

        </section>
    );
};

export default OrderPage;
