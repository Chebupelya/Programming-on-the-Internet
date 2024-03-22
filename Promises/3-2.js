function secondJob() {
    return new Promise((resolve,rejects) =>{
        setTimeout(()=>{
            rejects("ERROR")
        }, 3000)
    })
}

secondJob().then((result) =>{
    console.log("С использованием обработчиков Promise:", result);
})
.catch((error) =>{
    console.log("Error: " + error);
})

async function testSecondJob() {
    try {
      const result = await secondJob();
      console.log("С использованием async/await:", result);
    } catch (error) {
      console.error("Ошибка:", error);
    }
}
testSecondJob();