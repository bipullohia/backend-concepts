const app = require("express")(); //importing the express framework
const jobs = {};

app.post("/submit", (req, resp) => {
    const jobId = `${Date.now()}`;  // Generate a unique jobId using the current timestamp
    jobs[jobId] = 0;  // Initialize the job with 0% progress
    
    updateJob(jobId, 0); //update the job progress
    
    resp.end("\n" + jobId + "\n"); //respond with jobId
})

app.get("/checkjob", (req, resp) => {
    console.log(jobs[req.query.jobId]);
    resp.end("\nJob Status: " + jobs[req.query.jobId] + "%\n");
})

//instructs the server to listen on port 8080 and logs a message to indicate that the server is running.
app.listen(8080, () => console.log("Listening on port 8080..."));

function updateJob(jobId, progress){
    jobs[jobId] = progress; //update job progress
    console.log(`updated ${jobId} to ${progress}%`); 
    
    if(progress == 100) return; //stop updating if progress reaches 100%
    
    //update the progress every 3 secs
    this.setTimeout(() => {
        updateJob(jobId, progress+10) 
    }, 3000);
}

