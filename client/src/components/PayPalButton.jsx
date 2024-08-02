import React, { useEffect } from 'react';

const PayPalButton = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://www.paypal.com/sdk/js?client-id=AeGqPuPmSf7xDBPlQiTO_qbnj7x3yuMSV__c3MDOWYhw-HAZRAs1Fdv3zbZVIW1mBoXw7RWkEqqh55sN";
        script.async = true;
        script.onload = () => {
            window.paypal.Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: '0.01' // Replace with the actual amount
                            }
                        }]
                    });
                },
                onApprove: (data, actions) => {
                    return actions.order.capture().then((details) => {
                        alert('Transaction completed by ' + details.payer.name.given_name);
                    });
                }
            }).render('#paypal-button-container');
        };
        document.body.appendChild(script);
    }, []);

    return <div id="paypal-button-container"></div>;
};

export default PayPalButton;
