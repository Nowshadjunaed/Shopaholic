import {
  LIST_MY_TRANSACTION_FAIL,
  LIST_MY_TRANSACTION_REQUEST,
  LIST_MY_TRANSACTION_SUCCESS,
} from "../constants/transactionConstants";
import axios from "axios";
import { logout } from "./userActions";

export const listMyTransactions = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: LIST_MY_TRANSACTION_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(
      `/bankapi/transactions/myTransactions/${id}`,
      config
    );

    dispatch({
      type: LIST_MY_TRANSACTION_SUCCESS,
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
      type: LIST_MY_TRANSACTION_FAIL,
      payload: message,
    });
  }
};
