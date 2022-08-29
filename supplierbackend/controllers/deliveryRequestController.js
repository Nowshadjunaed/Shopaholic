import asyncHandler from "express-async-handler";
import axios from "axios";

// @desc    Handle Delivery Request
// @route   POST /supplierapi/deliveryRequest
// @access  Public
const deliveryRequest = asyncHandler(async (req, res) => {
  try {
    const supplierPaymentResultList = req.body.supplierPaymentResultList;
    let numberOfSuccessfulDeliveryRequest = 0;
    let iteration = 0;

    // loop through all the transactions
    supplierPaymentResultList.forEach(async (paymentResult) => {
      // check if the transaction exists
      const transactionNumber = paymentResult.transactionNumber;
      try {
        console.log("eta bank er port number", process.env.PORT_BANK);
        const isExistsResponse = axios.get(
          `http://127.0.0.1:${process.env.PORT_BANK}/bankapi/transactions/${transactionNumber}/exists`
        );

        isExistsResponse.then(function (result) {
          iteration = iteration + 1;
          console.log("isExistsResponse then er vitore", result.data);
          const isExists = result.data.isExists;
          if (isExists) {
            numberOfSuccessfulDeliveryRequest =
              numberOfSuccessfulDeliveryRequest + 1;
          }

          onComplete();
        });
      } catch (error) {
        console.error(error);
      }
    });

    //check after each forEach iteration. if all the delivery requests to suppliers are successful then the overall delivery request is successful
    function onComplete() {
      console.log(
        "numberOfSuccessfulDeliveryRequest",
        numberOfSuccessfulDeliveryRequest
      );
      if (iteration != supplierPaymentResultList.length) return;
      console.log(
        "numberOfSuccessfulDeliveryRequest ",
        numberOfSuccessfulDeliveryRequest,
        " ",
        "iteration ",
        iteration
      );
      if (
        numberOfSuccessfulDeliveryRequest == supplierPaymentResultList.length
      ) {
        res.status(201).json({
          isDeliveryRequestSuccessful: true,
        });
      } else {
        res.status(201).json({
          isDeliveryRequestSuccessful: false,
        });
      }
    }
  } catch (error) {
    res.status(404).json(error);
  }
});
export { deliveryRequest };
