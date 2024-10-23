import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../Urls/Urls';
import { Link } from 'react-router-dom';

const OrderList = () => {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = () => {
      axios.get(`${BASE_URL}/view-orders`, { withCredentials: true }).then((response) => {
        console.log('orders res', response.data.orders);
        setOrders(response.data.orders);
        setLoading(false)
      });
    };
    fetchOrders();
    
  }, []); 

  return (
    <section className="order-list-section">

      <div className="container con">
        {loading?
          <div className="loading-spinner">

            <div className="spinner-segment"></div>
            <div className="spinner-segment"></div>
            <div className="spinner-segment"></div>
          </div>
       : (orders && orders.length > 0 ? (
          <>
            
            <h4 className="section-title">Ordered Items</h4>
            <div className="table-responsive">
              <table className="table table-striped table-bordered mt-5">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Address</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <React.Fragment key={order._id}>
                      <tr>
                        <td>{order.date}</td>
                        <td>
                          {order.deliveryDetails.address}, {order.deliveryDetails.pinncode}
                        </td>
                        <td>{order.total ? order.total : order.product.Price}</td>
                        <td>
                          <span className={`badge ${order.status === 'Delivered' ? 'badge-success' : 'badge-warning'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <Link to={`/view-orders-products/${order._id}`} className="btn btn-primary btn-sm">
                            View Details
                          </Link>
                        </td>
                      </tr>

                      {/* Order Tracking Row */}
                      <tr>
                        <td colSpan="5">
                          <div className="row justify-content-between">
                            <div className={`order-tracking ${order.status ? 'completed' : ''}`}>
                              <span className="is-complete"></span>
                              <p>Ordered</p>
                            </div>
                            <div className={`order-tracking ${order.status2 ? 'completed' : ''}`}>
                              <span className="is-complete"></span>
                              <p>Shipped</p>
                            </div>
                            <div className={`order-tracking ${order.status3 ? 'completed' : ''}`}>
                              <span className="is-complete"></span>
                              <p>Delivered</p>
                            </div>
                          </div>
                        </td>

                      </tr>


                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <h5 className="no-orders">You don't have any orders</h5>
        ))
    }
      </div>
    </section>
  );
};

export default OrderList;
