const app = require("express")();
const {Client} = require("pg"); //we need Client (an entity in pg library) to connect to the postgres
const HashRing = require("hashring"); 
const crypto = require("crypto");

const hr = new HashRing(); //hr represents a hash ring - the library for hashing our url to know which sharded db server to go to
hr.add("5432");
hr.add("5433");
hr.add("5434");

//json objects - key is based on port
const clients = {
    "5432": new Client({
        "host": "localhost",
        "port": "5432",
        "user": "postgres",
        "password": "password",
        "database": "postgres"
    }),
    "5433": new Client({
        "host": "localhost",
        "port": "5433",
        "user": "postgres",
        "password": "password",
        "database": "postgres"
    }),
    "5434": new Client({
        "host": "localhost",
        "port": "5434",
        "user": "postgres",
        "password": "password",
        "database": "postgres"
    })
}

//info used to connect via pgadmin in docker
//"host": "172.17.0.4",
//"port": "5432"

connect();

//can implement with try-catch for more control
async function connect(){
    await clients["5432"].connect();
    await clients["5433"].connect();
    await clients["5434"].connect();
    console.log("Connected to all pg clients!");
}

app.get("/:urlId", async (req, res) => {
    //https://localhost:8081/fynce
    const urlId = req.params.urlId;
    const server = hr.get(urlId);
    const result = await clients[server].query("Select url from url_table where url_id=$1", [urlId]);
    if(result.rowCount > 0){
        res.send({
            "url": result.rows[0],
            "urlId": urlId,
            "server": server
        });
    }else{
        res.sendStatus(404);
    }

});

app.post("/", async (req, res) => {
    const url = req.query.url;
    //www.wikipedia.com/sharding
    //consistently hash this to get a port (to know which sharded db server to go to)
    const hash = crypto.createHash("sha256").update(url).digest("base64");
    const urlId = hash.substring(0, 5); //we only need the first 5 chars (not the best url shortener in the world)
    const server = hr.get(urlId); //getting 1 out of 3 servers we defined in the hash ring
    
    //inserting into the selected server of postgres
    await clients[server].query("insert into url_table (url, url_id) values ($1, $2)", [url, urlId]);

    res.send({
        "url": url,
        "urlId": urlId,
        "server": server
    });
});

var server = app.listen(8081, () => {
    console.log("Listening!!!");
});

server.timeout = 1000000;


/* Run from browser:
const urls = [];
for(let i=0; i<100; i++) urls.push(`https://www.google.com?q=${i}`);
urls.forEach(u => fetch(`http://localhost:8081/?url=${u}`, {"method":"POST"}).then(a=> a.json()).then(console.log));

*/