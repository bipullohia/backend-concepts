/*This code essentially creates a publisher that sends a message (a number) to the "jobs" queue on a RabbitMQ server specified by the URL amqpServer.
  The message is obtained from the command line arguments when running the script.
*/

const amqp = require("amqplib"); //amqplib library provides an interface for interacting with RabbitMQ.

//It parses the second argument passed while running the script using Node.js. The argument is expected to be a number, and it's assigned to the number property of the msg object.
const msg = {number: process.argv[2]} 
connect();

async function connect(){
    try{
        const amqpServer = "amqp://localhost:5672"; //url of the local/remote rabbitMQ server
        const connection = await amqp.connect(amqpServer);
        const channel = await connection.createChannel();

        //The queue named "jobs" is asserted. If the queue doesn't exist, it will be created.
        await channel.assertQueue("jobs");
        //The message (converted to a JSON string and then to a buffer) is sent to the "jobs" queue using channel.sendToQueue
        await channel.sendToQueue("jobs", Buffer.from(JSON.stringify(msg)));

        console.log(`Job sent successfully ${msg.number}`);

        await channel.close();
        await connection.close();
    }
    catch(ex){
        console.error(ex);
    }
}


//we can run this file by: node publisher.js 1234 - it will send the job 1234 successfully to the jobs queue rabbitMQ server