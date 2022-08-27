import React, { useCallback, useEffect, useState } from "react";
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
import { getOrderDetails, payOrderSupplier } from "../actions/orderActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import axios from "axios";

import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../constants/orderConstants";
import { SUPPLIER_PERCENTAGE } from "../constants/adminConstants";

const OrderSupplierPaymentScreen = () => {
  const [supplierPaymentDetails, setSupplierPaymentDetails] = useState([]);

  const { id } = useParams();
  const orderId = id;

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const orderSupplierPay = useSelector((state) => state.orderSupplierPay);
  const {
    loading: loadingSupplierPay,
    success: successSupplierPay,
    error: errorSupplierPay,
  } = orderSupplierPay;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;
  console.log("eta order ", order);

  const getSupplierPaymentDetails = useCallback(async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.get(`/api/orders/${id}`, config);

    console.log("eta api er data ", data.orderItems);
    const order = data;

    //   Calculate prices
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    };
    // put the supplier payment details in an object
    let supplierPaymentDetailsObject = {};
    order.orderItems.forEach((orderItem) => {
      // add supplier name, email, and amount to a object
      if (
        orderItem.product.supplierBankAccount in supplierPaymentDetailsObject
      ) {
        supplierPaymentDetailsObject[
          orderItem.product.supplierBankAccount
        ].amount = addDecimals(
          addDecimals(
            supplierPaymentDetailsObject[orderItem.product.supplierBankAccount]
              .amount
          ) +
            orderItem.qty * orderItem.price * Number(SUPPLIER_PERCENTAGE)
        );
      } else {
        supplierPaymentDetailsObject[orderItem.product.supplierBankAccount] = {
          name: orderItem.product.supplierName,
          email: orderItem.product.supplierEmail,
          bankAccount: orderItem.product.supplierBankAccount,
          amount: addDecimals(
            orderItem.qty * orderItem.price * Number(SUPPLIER_PERCENTAGE)
          ),
        };
      }
    });

    // convert supplierPaymentDetails object to list
    let supplierPaymentDetailsList = [];
    for (let key in supplierPaymentDetailsObject) {
      supplierPaymentDetailsList.push(supplierPaymentDetailsObject[key]);
    }

    setSupplierPaymentDetails(supplierPaymentDetailsList);
  }, [id, userInfo]);

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate("/login");
    } else {
      console.log("eta order id", orderId);
      dispatch(getOrderDetails(orderId));
      getSupplierPaymentDetails();
    }
  }, [dispatch, getSupplierPaymentDetails, id, navigate, orderId, userInfo]);

  const payOrderSupplierHandler = () => {
    dispatch(payOrderSupplier(orderId, supplierPaymentDetails));
  };

  return (
    <>
      <h1>Order {orderId} - Supplier Payment</h1>
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
          {supplierPaymentDetails &&
            supplierPaymentDetails.map((supplier) => (
              <tr key={supplier.bankAccount}>
                <td>{supplier.name}</td>
                <td>{supplier.email}</td>
                <td>{supplier.bankAccount}</td>
                <td>${supplier.amount}</td>
              </tr>
            ))}
        </tbody>
      </Table>
      {loadingSupplierPay && <Loader />}
      <Button
        variant="primary"
        className="btn-sm"
        onClick={() => payOrderSupplierHandler()}
      >
        Pay Now
      </Button>
      {order?.isSupplierPaid && <h>dsklfad;fljsd</h>}

      {/* {userInfo &&
              userInfo.isAdmin &&
              !order.isSupplierPaid &&
              (
                <ListGroupItem>
                  <Button
                    type="button"
                    className="btn btn-block"
                    onClick={deliverHandler}
                  >
                    Mark As Delivered
                  </Button>
                </ListGroupItem>
              )} */}
    </>
  );
};

export default OrderSupplierPaymentScreen;
