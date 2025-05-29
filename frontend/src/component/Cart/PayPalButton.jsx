import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PayPalButton = ({ amount, onSuccess, onError }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <PayPalScriptProvider
      options={{
        "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
      }}
    >
      <div className="flex justify-center items-center">
        <PayPalButtons
          style={{
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "pay",
            tagline: false,
          }}
          createOrder={(data, actions) =>
            actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: parseFloat(amount).toFixed(2),
                  },
                },
              ],
            })
          }
          onApprove={(data, actions) => {
            setIsProcessing(true);
            actions.order.capture().then((details) => {
              setIsProcessing(false);
              onSuccess(details);
            });
          }}
          onError={(err) => {
            console.error("PayPal error:", err);
            setIsProcessing(false);
            if (onError) onError(err);
          }}
        />
        {isProcessing && (
          <div className="absolute text-white bg-black rounded-md py-2 px-6 mt-4">
            Processing Payment...
          </div>
        )}
      </div>
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
