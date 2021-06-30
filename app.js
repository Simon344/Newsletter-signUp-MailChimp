const express = require("express");
const bodyParser = require("body-parser");
const request  = require("request");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res){
    const firstName = req.body.firstname;
    const lastName = req.body.lastname;
    const email = req.body.email;
    console.log(firstName, lastName, email);

    //data format of mailchimp api
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }
    let jsonData = JSON.stringify(data);    //stringify data for sending
    
    //replace LIST_KEY with your list key and API_KEY with your API key
    const url = "https://us6.api.mailchimp.com/3.0/lists/LIST_KEY";
    const options = {
        method: "POST",
        auth: "cyemon:API_KEY"
    }
    const request = https.request(url, options, function(response){
        console.log(response.statusCode);
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", function(data){
            //console.log(data);
            const parsedData = JSON.parse(data);
            //console.log(parsedData);
        })
    })

    request.write(jsonData);
    request.end();
})

app.post("/failure", function(req, res){
    res.redirect("/");
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function(){
    console.log(`Server running on port ${port}`);
})
