import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserDetails } from "../actions/userActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

const ProfileScreen = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [account_number, setAccountNo] = useState("");
  const [current_balance, setCurrentBalance] = useState(0);

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // redirect to login when not logged in
  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      if (!user.name) {
        dispatch(
          getUserDetails("profile", {
            account_number: userInfo.account_number,
          })
        );
      } else {
        setName(user.name);
        setEmail(user.email);
        setAccountNo(user.account_number);
        setCurrentBalance(user.current_balance);
      }
    }
  }, [
    navigate,
    userInfo,
    dispatch,
    user.name,
    user.email,
    user.account_number,
    user.current_balance,
  ]);

  return (
    <Row>
      <Col sm={3} md={8} lg={10}>
        <h2 className="my-3">User Profile</h2>
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}
        {/*  */}

        <div className="col-md-8 ">
          <div className="card mb-3">
            <div className="card-body">
              <div className="row">
                <div className="col-sm-3">
                  <h6 className="mb-0">Full Name</h6>
                </div>
                <div className="col-sm-9 text-secondary">{name}</div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <h6 className="mb-0">Email</h6>
                </div>
                <div className="col-sm-9 text-secondary">{email}</div>
              </div>
              <hr />

              <div className="row">
                <div className="col-sm-3">
                  <h6 className="mb-0">Account Number</h6>
                </div>
                <div className="col-sm-9 text-secondary">{account_number}</div>
              </div>
              <hr />

              <div className="row">
                <div className="col-sm-3">
                  <h6 className="mb-0">Current Balance</h6>
                </div>
                <div className="col-sm-9 text-secondary">{current_balance}</div>
              </div>
              <hr />
            </div>
          </div>
        </div>

        {/*  */}
      </Col>
    </Row>
  );
};

export default ProfileScreen;
