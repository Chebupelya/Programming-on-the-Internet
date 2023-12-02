const firstJob = () => {
    return new Promise((resolve,rejects) => {
        setTimeout(() => resolve("Hello World!!!"), 2000);
    })
};

firstJob().then(result => 
    console.log(result)).catch((err) => 
    console.log("Error: " + err));

async function testFirstJob() {
    try{
        var result = await firstJob();
        console.log(result);
    }
    catch(err){
        console.log("Error = " + err);
    }

}
testFirstJob();
