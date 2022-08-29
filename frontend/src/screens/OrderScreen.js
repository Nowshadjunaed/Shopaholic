import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Image,
  ListGroup,
  ListGroupItem,
  Row,
  Form
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from "../actions/orderActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import axios from "axios";

import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../constants/orderConstants";

import { ADMIN_BANK_ACCOUNT } from "../constants/adminConstants";

const OrderScreen = () => {
  const { id } = useParams();
  const orderId = id;

  //const [BankPin, setPin] = useState('')

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;
  // console.log("order in orderscreen ", order);

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  if (!loading) {
    //   Calculate prices
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    };

    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
  }

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
    if (!order || successPay || successDeliver || order._id !== orderId) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    }
  }, [
    dispatch,
    orderId,
    successPay,
    order,
    successDeliver,
    userInfo,
    navigate,
  ]);

  const payNowHandler = async (total_amount) => {
    //console.log("Ekhane PIN print HObe", BankPin)
    console.log(order.user);
    const paymentData = {
      email: order.user.email,
      account_number: order.user.account_number,
      amount: total_amount,
      receiver_account_number: ADMIN_BANK_ACCOUNT,
      //password: BankPin
    };
    try {
      const bank_api_call = axios.post(`/bankapi/payment`, paymentData);
      console.log("promise er age:" + bank_api_call);

      bank_api_call.then(function (result) {
        console.log("ekhane bank_api: " + result.data);
        console.log("hoise mama");
        const DataReceivedFromBankApi = {
          id: result.data.id,
          email: result.data.email,
          status: result.data.status,
          update_time: result.data.update_time,
        };
        dispatch(payOrder(orderId, DataReceivedFromBankApi));
      });
    } catch (error) {
      //console.log('paycall err: ',error)
    }
  };

  // const deliverHandler = () => {
  //   dispatch(deliverOrder(order));
  // };

  const invoiceHandler = async () => {
    try {
      const invoicedata = {
        orderlist: order
  }
      
      const invoiceRouteCall = axios.post(`/api/invoice`, invoicedata);
      console.log("invoice promise er age:" + invoiceRouteCall);

      invoiceRouteCall.then(function (result) {
        console.log("invoice ekhane bank_api: " + result.data.message);
        console.log("hoise mama");
        window.open('http://localhost:3000/invoices/'+order._id +'.pdf', '_blank');
        
      });
    } catch (error) {
      console.log("invoice: " + error)
    }

  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{" "}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
                
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

            </ListGroup>
            {/* {!order.isPaid&&(
            <ListGroup.Item>
              
            <Form >
            
            <Form.Group controlId='BankPin'>
                <Form.Control type='password' placeholder='Enter PIN' value={BankPin} onChange={(e) => setPin(e.target.value)}>
                </Form.Control>
            </Form.Group>
            </Form>
            </ListGroup.Item>
            )} */}
            {!order.isPaid && (
              
              <ListGroup.Item>
                {loadingPay && <Loader />}
                <Button
                  type="button"
                  className="btn-block col-12"
                  onClick={() => {
                    payNowHandler(order.totalPrice);
                  }}
                >
                  Pay Now
                </Button>
              </ListGroup.Item>
            )}
            {loadingDeliver && <Loader />}
            {userInfo &&
              order.isPaid && (
                
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn-block col-12"
                    onClick={invoiceHandler}
                  >
                    View Invoice
                  </Button>
                </ListGroup.Item>
              )}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
