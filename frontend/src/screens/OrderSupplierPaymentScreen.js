import React, { useEffect, useState, useCallback } from "react";
import {
  Button,
  Card,
  Col,
  ListGroup,
  ListGroupItem,
  Row,
  Table,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getOrderSupplierPaymentDetails,
  payOrderSupplier,
} from "../actions/orderActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import axios from "axios";

const OrderSupplierPaymentScreen = () => {
  const [order, setOrder] = useState({});

  const { id } = useParams();
  const orderId = id;

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
    const { data } = await axios.get(`/api/orders/${id}`, config);
    console.log("berfore setOrder", data);

    setOrder(data);
    console.log("after setOrder", data);
  }, [id, userInfo.token]);

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate("/login");
    } else {
      getOrderDetails();
      dispatch(getOrderSupplierPaymentDetails(orderId));
    }
  }, [dispatch, getOrderDetails, navigate, orderId, userInfo]);

  const payOrderSupplierHandler = (async) => () => {
    dispatch(payOrderSupplier(orderId, dataSupplierPayDetails));
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

      {loadingSupplierPayDetails || loadingSupplierPay ? (
        <Loader />
      ) : errorSupplierPay ? (
        <Message variant="danger">{errorSupplierPay}</Message>
      ) : order?.isSupplierPaid ? (
        <Button variant="success" className="btn-sm disabled">
          Paid At {order?.supplierPaidAt?.substring(0, 10)}
        </Button>
      ) : (
        <Button
          variant="primary"
          className="btn-sm"
          onClick={() => payOrderSupplierHandler()}
        >
          Pay Now
        </Button>
      )}
    </>
  );
};

export default OrderSupplierPaymentScreen;
