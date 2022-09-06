import axios from "axios";
import {
  ADMIN_BANK_ACCOUNT,
  ADMIN_EMAIL,
  SUPPLIER_PERCENTAGE,
} from "../constants/adminConstants";
import { CART_CLEAR_ITEMS } from "../constants/cartConstants";
import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_REQUEST,
  ORDER_PAY_FAIL,
  ORDER_PAY_SUCCESS,
  ORDER_PAY_REQUEST,
  ORDER_LIST_MY_REQUEST,
  ORDER_LIST_MY_SUCCESS,
  ORDER_LIST_MY_FAIL,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_FAIL,
  ORDER_DELIVER_REQUEST,
  ORDER_DELIVER_SUCCESS,
  ORDER_DELIVER_FAIL,
  ORDER_SUPPLIER_PAY_REQUEST,
  ORDER_SUPPLIER_PAY_SUCCESS,
  ORDER_SUPPLIER_PAY_FAIL,
  ORDER_SUPPLIER_PAY_DETAILS_REQUEST,
  ORDER_SUPPLIER_PAY_DETAILS_SUCCESS,
  ORDER_SUPPLIER_PAY_DETAILS_FAIL,
  ORDER_SUPPLIER_PAY_RESET,
  ORDER_LIST_REQUEST,
} from "../constants/orderConstants";
import { logout } from "./userActions";

export const createOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_CREATE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(`/api/orders`, order, config);

    dispatch({
      type: ORDER_CREATE_SUCCESS,
      payload: data,
    });
    dispatch({
      type: CART_CLEAR_ITEMS,
      payload: data,
    });
    localStorage.removeItem("cartItems");
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload: message,
    });
  }
};

export const getOrderDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_DETAILS_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/orders/${id}`, config);

    dispatch({
      type: ORDER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload: message,
    });
  }
};

export const payOrder =
  (orderId, paymentResult) => async (dispatch, getState) => {
    try {
      dispatch({
        type: ORDER_PAY_REQUEST,
      });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `/api/orders/${orderId}/pay`,
        paymentResult,
        config
      );

      dispatch({
        type: ORDER_PAY_SUCCESS,
        payload: data,
      });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      if (message === "Not authorized, token failed") {
        dispatch(logout());
      }
      dispatch({
        type: ORDER_PAY_FAIL,
        payload: message,
      });
    }
  };

export const payOrderSupplier =
  (orderId, supplierPaymentDetails, BankPin) => async (dispatch, getState) => {
    try {
      dispatch({
        type: ORDER_SUPPLIER_PAY_REQUEST,
      });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      let supplierPaymentResultList = [];
      let successfulTransaction = 0;

      // if all the payment are possible then this block runs
      const proceedTransaction = async () => {
        console.log("ekhon proceed er block e");
        // pays each supplier
        for(const supplier of supplierPaymentDetails){
          console.log("eta supplier payment details er element", supplier);
          try {
            const paymentData = {
              email: ADMIN_EMAIL,
              account_number: ADMIN_BANK_ACCOUNT,
              amount: supplier.amount,
              receiver_account_number: supplier.bankAccount,
              password: BankPin
            };

            const data = await axios.post(
              `/bankapi/payment`,
              paymentData,
              config
            ).catch( (error) =>{
              console.log("eta kaj korse",error.response.data.message)
              dispatch({
                type: ORDER_SUPPLIER_PAY_FAIL,
                payload: "Invalid PIN",
              });
      
            });
            const supplierPaymentResult = data?.data
            if (supplierPaymentResult) successfulTransaction++;

            const supplierPaymentTransaction = {
              supplierBankAccount: supplier.bankAccount,
              transactionNumber: supplierPaymentResult?.id,
              amount: supplier.amount,
            };

            // push each transaction details into a list to send backend to update the order
            supplierPaymentResultList.push(supplierPaymentTransaction);

            console.log(
              "order update korar condition",
              successfulTransaction,
              " ",
              successfulTransactionPossible
            );
            if (successfulTransaction === successfulTransactionPossible) {
              // save supplier payment details to the order if all the payments are successful
              const updatedOrder = axios.put(
                `/api/orders/${orderId}/supplierPay`,
                supplierPaymentResultList,
                config
              );

              const data = {
                supplierPaymentResultList: supplierPaymentResultList,
              };

              dispatch({
                type: ORDER_SUPPLIER_PAY_SUCCESS,
                payload: data,
              });
            }
          } catch (error) {
            const message =
              error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
            if (message === "Not authorized, token failed") {
              dispatch(logout());
            }
            dispatch({
              type: ORDER_SUPPLIER_PAY_FAIL,
              payload: message,
            });
          }
        }//);
      };

      let successfulTransactionPossible = 0;
      supplierPaymentDetails.forEach(async (supplier) => {
        const paymentData = {
          email: ADMIN_EMAIL,
          account_number: ADMIN_BANK_ACCOUNT,
          amount: supplier.amount,
          receiver_account_number: supplier.bankAccount,
        };

        const { data } = await axios.post(
          `/bankapi/payment/possible`,
          paymentData
        );
        console.log("eta payment possible er response", data);
        const { isPaymentPossible } = data;
        if (isPaymentPossible) {
          successfulTransactionPossible = successfulTransactionPossible + 1;
        }

        // if all the transactions are possible then execute them
        console.log(
          "successful transaction possible",
          successfulTransactionPossible
        );
        if (
          Number(successfulTransactionPossible) ===
          supplierPaymentDetails.length
        ) {
          console.log("transaction is proceeeeeeeeeeding");
          proceedTransaction();
        }
      });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      if (message === "Not authorized, token failed") {
        dispatch(logout());
      }
      dispatch({
        type: ORDER_SUPPLIER_PAY_FAIL,
        payload: message,
      });
    }
  };

export const listOrders = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_LIST_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/orders`, config);

    dispatch({
      type: ORDER_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: ORDER_LIST_FAIL,
      payload: message,
    });
  }
};

export const deliverOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_DELIVER_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(
      `/api/orders/${order._id}/deliver`,
      {},
      config
    );

    dispatch({
      type: ORDER_DELIVER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: ORDER_DELIVER_FAIL,
      payload: message,
    });
  }
};

export const listMyOrders = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_LIST_MY_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/orders/myorders`, config);

    dispatch({
      type: ORDER_LIST_MY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: ORDER_LIST_MY_FAIL,
      payload: message,
    });
  }
};

export const getOrderSupplierPaymentDetails =
  (id) => async (dispatch, getState) => {
    try {
      dispatch({
        type: ORDER_SUPPLIER_PAY_DETAILS_REQUEST,
      });

      // reset previous payment status
      dispatch({
        type: ORDER_SUPPLIER_PAY_RESET,
      });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get(`/api/orders/${id}`, config);

      const order = data;

      //   Calculate prices
      const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
      };
      // put the supplier payment details in an object
      let supplierPaymentDetailsObject = {};
      order?.orderItems?.forEach((orderItem) => {
        // add supplier name, email, and amount to a object
        if (
          orderItem.product.supplierBankAccount in supplierPaymentDetailsObject
        ) {
          supplierPaymentDetailsObject[
            orderItem.product.supplierBankAccount
          ].amount = addDecimals(
            Number(
              supplierPaymentDetailsObject[
                orderItem.product.supplierBankAccount
              ].amount
            ) +
              orderItem.qty * orderItem.price * Number(SUPPLIER_PERCENTAGE)
          );
        } else {
          supplierPaymentDetailsObject[orderItem.product.supplierBankAccount] =
            {
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

      dispatch({
        type: ORDER_SUPPLIER_PAY_DETAILS_SUCCESS,
        payload: supplierPaymentDetailsList,
      });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      if (message === "Not authorized, token failed") {
        dispatch(logout());
      }
      dispatch({
        type: ORDER_SUPPLIER_PAY_DETAILS_FAIL,
        payload: message,
      });
    }
  };
