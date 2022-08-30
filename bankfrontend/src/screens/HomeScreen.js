import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "react-bootstrap";

import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader.js";
import Message from "../components/Message.js";
import { listMyTransactions } from "../actions/transactionActions.js";

const Homescreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, transactions } = useSelector(
    (state) => state.listMyTransaction
  );

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo) {
      dispatch(listMyTransactions(userInfo?._id));
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate, userInfo]);

  return (
    <>
      <h1>Your Transactions</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : transactions ? (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>Transaction Id</th>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Amount</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>{transaction._id}</td>
                <td>{transaction.sender}</td>
                <td>{transaction.receiver}</td>
                <td>${transaction.transactionAmount}</td>
                <td>{transaction.createdAt?.substring(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        "Please Login"
      )}
    </>
  );
};

export default Homescreen;
