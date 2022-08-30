import {
  LIST_MY_TRANSACTION_FAIL,
  LIST_MY_TRANSACTION_REQUEST,
  LIST_MY_TRANSACTION_RESET,
  LIST_MY_TRANSACTION_SUCCESS,
} from "../constants/transactionConstants";

export const listMyTransactionReducer = (
  state = { transactions: [] },
  action
) => {
  switch (action.type) {
    case LIST_MY_TRANSACTION_REQUEST:
      return {
        loading: true,
      };
    case LIST_MY_TRANSACTION_SUCCESS:
      return {
        loading: false,
        transactions: action.payload,
      };
    case LIST_MY_TRANSACTION_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case LIST_MY_TRANSACTION_RESET:
      return { transactions: [] };
    default:
      return state;
  }
};
