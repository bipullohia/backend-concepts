const app = require("express")();

//to prevent CORS - a return on root of the server
app.get("/", (req, resp) => resp.send("Hello world!"));

//Clients can connect to /stream and receive updates in real-time.
app.get("/stream", (req, resp) => {
    resp.setHeader("Content-Type", "text/event-stream");
    send(resp);
});

let i = 0;
function send(resp) {
    resp.write("data: " + `Hello from the server side... #${i++}\n\n`);

    setTimeout(() => send(resp), 1000);
}

const port = 8090;
app.listen(port);
console.log(`Listening on port ${port}`);



/* Client code (can be written in a browser)
let sse = new EventSource("http://localhost:8080/stream");
sse.onmessage = console.log
*/