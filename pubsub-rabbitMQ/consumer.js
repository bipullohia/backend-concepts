const amqp = require("amqplib");

connect();
async function connect(){
    try{
        const amqpServer = "amqp://localhost:5672"; //url of the local/remote rabbitMQ server
        const connection = await amqp.connect(amqpServer);
        const channel = await connection.createChannel();

        await channel.assertQueue("jobs");
        channel.consume("jobs", message => {
            const input = JSON.parse(message.content.toString());
            console.log(`Received from job with input: ${input.number}`);

            /*If the input number is 7007, the message is acknowledged using channel.ack(message). 
             -Acknowledging a message means that the consumer has successfully processed the message, 
             -and RabbitMQ won't send it to any other consumer.
             */
            if(input.number == 7007)
                channel.ack(message);
        })

        console.log("Waiting for msgs...");
    } catch(ex){
        console.log(ex);
    }
}