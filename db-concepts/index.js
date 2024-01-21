const app = require("express")();
const {Client} = require("pg"); //we need Client (an entity in pg library) to connect to the postgres
const ConsistentHash = require("consistent-hash"); //to use the library for hashing our url to know which sharded db server to go to
const crypto = require("crypto");

const hr = new ConsistentHash(); //hr represents a hash ring
hr.add("5432");
hr.add("5433");
hr.add("5434");

//json objects - key is based on port
const clients = {
    "5432": new Client({
        "host": "172.17.0.2",
        "port": "5432",
        "user": "postgres",
        "password": "password",
        "database": "postgres"
    }),
    "5433": new Client({
        "host": "172.17.0.3",
        "port": "5432",
        "user": "postgres",
        "password": "password",
        "database": "postgres"
    }),
    "5434": new Client({
        "host": "172.17.0.4",
        "port": "5432",
        "user": "postgres",
        "password": "password",
        "database": "postgres"
    })
}

connect();

//can implement with try-catch for more control
async function connect(){
    await clients["5432"].connect();
    await clients["5433"].connect();
    await clients["5434"].connect();
}

app.get("/", (req, res) => {

});

app.post("/", (req, res) => {
    const url = req.query.url;

    //consistently hash this to get a port (to know which sharded db server to go to)
});