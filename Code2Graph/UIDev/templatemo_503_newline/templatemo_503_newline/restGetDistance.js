/**
 * Created by Marmik on 04/10/2016.
 */
var express = require('express');
var app = express();
var request = require('request');
var formidable = require('formidable');
var fs = require('fs');
var url = require('url');
const { parse } = require('querystring');
app.set('view engine', 'html');
//This body-parser module parses the JSON, buffer, string and url encoded data submitted
// using HTTP POST request.
//Install body-parser using NPM as shown below.
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", function(req, res)
{
    res.sendFile("index2.html", {"root": __dirname});
});

app.post('/getDistance', function (req, res) {
    var origin = req.body.origin;
    var destination = req.body.destination;
    var result={
        'location': []
    };
    var name = 'hello';

    //res.render(__dirname + "/index.html", {name:name});

    console.log("In restDistance " + origin + destination);
    request('https://maps.googleapis.com/maps/api/distancematrix/json?' +
        'language=en&units=imperial' +
        '&origins=' + origin +
        '&destinations=' + destination +
        '&key=AIzaSyB087vg5c4hTnohVi4sjP63cHv4Eh3jt2s', function (error, response, body) {
        //Check for error
        if(error){
            return console.log('Error:', error);
        }

        //Check for right status code
        if(response.statusCode !== 200){
            return console.log('Invalid Status Code Returned:', response.statusCode);
        }
        //All is good. Print the body
        body = JSON.parse(body);
        var loc = body.rows[0].elements; //first item of rows in JSON file
        //console.log(loc.elements[0].distance.text);
        //console.log(body.destination_addresses[0]);
        //console.log(loc.length);
        for(var i=0;i<loc.length;i++)
        {
            result.location.push({'distance': loc[i].distance.text,
                'duration':loc[i].duration.text.toString()});
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        var loc = body.rows[0].elements; //first item of rows in JSON file
        for (var i = 0; i < loc.length; i++) {
            result.location.push({
                'distance': loc[i].distance.text,
                'duration': loc[i].duration.text.toString()
            });
        }
        JSONResult = JSON.stringify(result);
        console.log(JSONResult);
        for (var i = 0; i<result.location.length; i++){
            console.log("\nThe Distance is: " + result.location[i].distance);
            console.log("\nThe Time is: " + result.location[i].duration);
        }
        res.write(JSONResult);
        res.end();
    });
    console.log(result);


})
app.get('/test', function(req, res, next) {
    res.json({ message: 'Hello World' });
});
var port = process.env.PORT || 8080;
var server = app.listen(port, function () {
    // var host = server.address().address
    var port = server.address().port;

    console.log("Distance App currently listening at http://127.0.0.1:%s",port)
})