const { v4: uuidv4 } = require('uuid');

function validateCard(cardNumber) {
    console.log("Card number:", cardNumber);
    return Math.random() < 0.5;
}

function proceedToPayment(orderNumber) {
    console.log("Order number:", orderNumber);

    return new Promise((resolve, reject) => {
        if (Math.random() < 0.5) {
            resolve("Payment successful");
        } else {
            reject("Payment failed");
        }
    });
}

function createOrder(cardNumber) {
    return new Promise((resolve, reject) => {
        if (validateCard(cardNumber)) {
            const orderNumber = uuidv4();
            setTimeout(() => {
                resolve(orderNumber);
            }, 5000);
        } else {
            reject("Card is not valid");
        }
    });
}


createOrder("1234 1234 1234 1234")
    .then(orderNumber => proceedToPayment(orderNumber))
    .then(successMessage => console.log(successMessage))
    .catch(error => console.log("Error1:", error));


// async function processOrder() {
//     try {
//         const orderNumber = await createOrder("1234567890123456");
//         const successMessage = await proceedToPayment(orderNumber);
//         console.log(successMessage);
//     } catch (error) {
//         console.log("Error2:", error);
//     }
// }
// processOrder();