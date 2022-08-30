import React, { useEffect, useState, useCallback } from "react";
import {
  Button,
  Card,
  Col,
  ListGroup,
  ListGroupItem,
  Row,
  Form,
  Table,
  Alert
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  deliverOrder,
  getOrderSupplierPaymentDetails,
  payOrderSupplier,
} from "../actions/orderActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import axios from "axios";

// payment button click -> payOrderSupplier dispatch
// if success supplier payment then delivery request to supplier
// if deliveryRequest is successul then deliver to user

const OrderSupplierPaymentScreen = () => {
  const [order, setOrder] = useState({});

  const { id: orderId } = useParams();

  console.log("eta orderId", orderId);
  console.log("eta order", order);

  const [BankPin, setPin] = useState('')
  const [InvalidPinMessage, setInvalidPinMessage] = useState(false)
  const [PinMessage,setPinMessage] = useState('')
  
  const navigate = useNavigate();

  const dispatch = useDispatch();

  // this state is for loading the supplier payment table
  const orderSupplierPayDetails = useSelector(
    (state) => state.orderSupplierPayDetails
  );
  const {
    loading: loadingSupplierPayDetails,
    data: dataSupplierPayDetails,
    error: errorSupplierPayDetails,
  } = orderSupplierPayDetails;

  // this state is for loading the payment to supplier button
  const orderSupplierPay = useSelector((state) => state.orderSupplierPay);
  const {
    loading: loadingSupplierPay,
    // supplierPaymentResult sent bynk to ecommerce is stored here
    supplierPay: supplierPaymentResultListObject,
    error: errorSupplierPay,
    success: successSupplierPay,
  } = orderSupplierPay;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // to get the order supplier payment status
  const getOrderDetails = useCallback(async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    try {
      const isOrderResponse = axios.get(`/api/orders/${orderId}`, config);

      console.log("isOrderResponsethen er age");

      isOrderResponse.then(function (result) {
        console.log("isOrderResponse then er pore");
        const order = result.data;
        console.log("eta then  er pore result data", result.data);
        console.log("eta order", order);
        setOrder(order);
      });
    } catch (error) {
      console.error(error);
    }
  }, [orderId, userInfo.token]);

  ////////////////////////////

  // function for sending api request to supplier with delivery request
  const deliveryRequestToSuppliers = useCallback(
    async (order, supplierPaymentResultList) => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        console.log(
          "eta deliveryRequest er vetor supplierPaymentResultList",
          supplierPaymentResultList
        );
        // send delivery request to supplier api
        const isDeliveryRequestSuccessfulResponse = axios.post(
          `/supplierapi/deliveryRequests`,
          supplierPaymentResultList,
          config
        );

        console.log("eta .then er age ", isDeliveryRequestSuccessfulResponse);

        isDeliveryRequestSuccessfulResponse.then(function (result) {
          const isDeliveryRequestSuccessful =
            result.data.isDeliveryRequestSuccessful;

          if (isDeliveryRequestSuccessful) {
            if (!order.isDeliverd) dispatch(deliverOrder(order));
          }
        });
      } catch (error) {}
    },

    [dispatch, userInfo.token]
  );

  // send delivery request after paying supplier
  if (successSupplierPay) {
    console.log("delivery request je order ke dicchi", order);
    if (!order.isDeliverd)
      deliveryRequestToSuppliers(order, supplierPaymentResultListObject);
  }

  /////////////////////////////////

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate("/login");
    }
  }, [navigate, userInfo]);

  useEffect(() => {
    getOrderDetails();
    dispatch(getOrderSupplierPaymentDetails(orderId));

    console.log("inside second useEffect");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const payOrderSupplierHandler = () => {
    if (!order?.isSupplierPaid) {
      dispatch(payOrderSupplier(orderId, dataSupplierPayDetails, BankPin));
    }
  };

  return (
    <>
      <h1>Order {orderId} - Supplier Payment</h1>
      {loadingSupplierPayDetails ? (
        <Loader />
      ) : errorSupplierPayDetails ? (
        <Message variant="danger">{errorSupplierPayDetails}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>SUPPLIER NAME</th>
              <th>SUPPLIER EMAIL</th>
              <th>SUPPLIER BANK ACCOUNT</th>
              <th>AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {dataSupplierPayDetails &&
              dataSupplierPayDetails.map((supplier) => (
                <tr key={supplier.bankAccount}>
                  <td>{supplier.name}</td>
                  <td>{supplier.email}</td>
                  <td>{supplier.bankAccount}</td>
                  <td>${supplier.amount}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}

      {/* payment button */}

      {loadingSupplierPayDetails ? (
        <></>
      ) : loadingSupplierPay ? (
        <Loader />
      ) : errorSupplierPay ? (
        <>
          <Message variant="danger">{errorSupplierPay}</Message>
          <Form >
          
            <Form.Group controlId='BankPin'>
                <Form.Control type='password' placeholder='Enter PIN' value={BankPin} onChange={(e) => setPin(e.target.value)}>
                </Form.Control>
            </Form.Group>
          </Form>

          <Button
            variant="primary"
            className="btn-sm"
            onClick={() => payOrderSupplierHandler()}
          >
            Pay Now
          </Button>
        </>
      ) : order?.isSupplierPaid || successSupplierPay ? (
        <Alert key={"success"} variant={"success"}>
          Paid
        </Alert>
      ) : (
        <>
        <Form >
        
          <Form.Group controlId='BankPin'>
              <Form.Control type='password' placeholder='Enter PIN' value={BankPin} onChange={(e) => setPin(e.target.value)}>
              </Form.Control>
          </Form.Group>
        </Form>

        <Button
          variant="primary"
          className="btn-sm"
          onClick={() => payOrderSupplierHandler()}
        >
          Pay Now
        </Button>
        </>
      )}
    </>
  );
};

export default OrderSupplierPaymentScreen;
