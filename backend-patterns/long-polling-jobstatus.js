const app = require("express")(); //importing the express framework
const jobs = {};

app.post("/submit", (req, resp) => {
    const jobId = `${Date.now()}`;  // Generate a unique jobId using the current timestamp
    jobs[jobId] = 0;  // Initialize the job with 0% progress
    
    updateJob(jobId, 0); //update the job progress
    
    resp.end("\n" + jobId + "\n"); //respond with jobId
})

//this is now async, which means the response will be sent in async way
app.get("/checkjob", async (req, resp) => {
    console.log(jobs[req.query.jobId]);

    //long polling, no response to be sent until job is done
    while(await checkJobComplete(req.query.jobId) == false); //The loop continues until the checkJobComplete function returns true, simulating long-polling.

    resp.end("\nJob Status: " + jobs[req.query.jobId] + "%\n");
})

//instructs the server to listen on port 8080 and logs a message to indicate that the server is running.
app.listen(8080, () => console.log("Listening on port 8080..."));

async function checkJobComplete(jobId){
    return new Promise( (resolve, reject) => {
        if(jobs[jobId] < 100)
            this.setTimeout(() => resolve(false), 1000);
        else
            resolve(true);
    });
}

function updateJob(jobId, progress){
    jobs[jobId] = progress; //update job progress
    console.log(`updated ${jobId} to ${progress}%`); 
    
    if(progress == 100) return; //stop updating if progress reaches 100%
    
    //update the progress every 3 secs
    this.setTimeout(() => {
        updateJob(jobId, progress+10) 
    }, 3000);
}

/*We can fetch this in the console side of a browser to check the 6 connection restriction on chrome side for a domain
 - fetch("http://localhost:8080/submit", {"method":"POST"}).then(a=> a.text()).then(console.log)
 - fetch("http://localhost:8080/checkjob?jobId:", {"method":"GET"}).then(a=> a.text()).then(console.log)
 */