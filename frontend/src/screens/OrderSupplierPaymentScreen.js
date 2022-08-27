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
import { payOrderSupplier } from "../actions/orderActions";
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

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

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
          Number(
            supplierPaymentDetailsObject[orderItem.product.supplierBankAccount]
              .amount
          ) +
            Number(orderItem.qty) *
              Number(orderItem.price) *
              Number(SUPPLIER_PERCENTAGE)
        );
      } else {
        supplierPaymentDetailsObject[orderItem.product.supplierBankAccount] = {
          name: orderItem.product.supplierName,
          email: orderItem.product.supplierEmail,
          bankAccount: orderItem.product.supplierBankAccount,
          amount: addDecimals(
            Number(orderItem.qty) *
              Number(orderItem.price) *
              Number(SUPPLIER_PERCENTAGE)
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
    if (!userInfo) {
      navigate("/login");
    } else {
      getSupplierPaymentDetails();
    }
  }, [dispatch, getSupplierPaymentDetails, id, navigate, orderId, userInfo]);

  const payOrderSupplierHandler = () => {
    dispatch(payOrderSupplier);
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
      <Button
        variant="primary"
        className="btn-sm"
        onClick={() => payOrderSupplierHandler()}
      >
        Pay Now
      </Button>
    </>
  );
};

export default OrderSupplierPaymentScreen;
