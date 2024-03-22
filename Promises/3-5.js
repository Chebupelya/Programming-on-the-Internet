function square(number) {
    return new Promise((resolve, reject) => {
        if (typeof number === 'number') {
            resolve(`${number * number}`);
        } else {
            reject("Error1");
        }
    });
}
  
function cube(number) {
    return new Promise((resolve, reject) => {
        if (typeof number === 'number') {
            resolve(`${number * number * number}`);
        } else {
            reject("Error2");
        }
    });
}
  
function fourthPower(number) {
    return new Promise((resolve, reject) => {
        if (typeof number === 'number') {
            resolve(`${number * number * number * number}`);
        } else {
            reject("Error3");
        }
    });
}

Promise.all([square(3), cube(3), fourthPower(3)])
    .then((results) => {
        console.log("Квадрат числа:", results[0]);
        console.log("Куб числа:", results[1]);
        console.log("4 степень числа:", results[2]);
    })
    .catch((err) => {
        console.log(err);
});
