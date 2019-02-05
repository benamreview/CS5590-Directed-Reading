/**
 * Created by Marmik on 04/10/2016.*/
var http = require('http');
var fs = require("fs");
var url = require('url');
const { parse } = require('querystring');
var port = process.env.PORT || 8080;
function renderHTML(path, response) {
    fs.readFile(path, null, function(error, data) {
        if (error) {
            response.writeHead(404);
            response.write('File not found!');
        } else {
            response.write(data);
        }
        response.end();
    });
}
// Create a server
http.createServer( function (req, res) {
    // Parse the request containing file name
    var pathname = url.parse(req.url).pathname;
    //console.log(request.url);
    // Print the name of the file for which request is made.
    console.log("Request for " + pathname + " received.");
    switch(pathname){
        //Default Home Page: index2.html.
        //if there is no specific route, direct to index2.html
        case '/':
            fs.readFile('index2.html', function (err, data) {
                if (err) {
                    console.log(err);
                    // HTTP Status: 404 : NOT FOUND
                    // Content Type: text/plain
                    res.writeHead(404, {'Content-Type': 'text/html'});
                }else {
                    //Page found
                    // HTTP Status: 200 : OK
                    // Content Type: text/plain
                    res.writeHead(200, {'Content-Type': 'text/html'});

                    // Write the content of the file to response body
                    res.write(data.toString());
                }
                // Send the response body
                res.end();
            });
        //If getDistance route is called, it means that user has clicked the button and
        //This is called via POST method of Jquery script in index2.html
        //This method will return JSON file which will be used in the distanceField Textbox
        //To show the approximate distance and time to travel from one location to another
        case '/testpage':
            fs.readFile('testpage.html', function (err, data) {
                if (err) {
                    console.log(err);
                    // HTTP Status: 404 : NOT FOUND
                    // Content Type: text/plain
                    res.writeHead(404, {'Content-Type': 'text/html'});
                }

                else {
                    //Page found
                    // HTTP Status: 200 : OK
                    // Content Type: text/plain
                    res.writeHead(200, {'Content-Type': 'text/html'});

                    // Write the content of the file to response body
                    res.write(data.toString());

                }
                // Send the response body
                res.end();
            });
        case '/getDistance':
            res.writeHead(200, {'Content-Type': 'application/json'});
            //These are the necessary variables for server to call the Google Distance Matrix API
            //These will be updated as soon as user has an input
            let resultBody ={
                'origin': "",
                'destination':""
            };
            if (req.method === 'POST') {
                let body = '';
                let JSONResult = "";
                /*This req.on() method is used to retrieve user input and put it into
                 * the chunk components and parse them one by one.
                  * Afterwards, these parsed strings will be passed to the origin and destination
                  * To be further injected in to the API call*/
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    resultBody.origin = parse(body).origin;
                    resultBody.destination = parse(body).destination;
                    console.log(
                        parse(body).origin
                    );
                    //These are user's input which will be substituted into the API request
                    var origin = resultBody.origin;
                    var destination = resultBody.destination;
                    //console.log("ORIGIN AND DESTINATION" + origin + destination);
                    /*
                     * Results of Google Distance Matrix API will be stored in this result.location array
                      * which will further contain the distance and duration variables*/
                    var result = {
                        'location': []
                    };
                    /*Standard GET URL for API request with user's origin and destination
                     * If there is no error, the JSON file will be assigned to the body variable
                      * the body variable will be further extracted for only relevant information to be displayed to the screen
                      * such as distance and duration attributes.*/
                    var request = require('request');
                    request('https://maps.googleapis.com/maps/api/distancematrix/json?' +
                        'language=en&units=imperial' +
                        '&origins=' + origin +
                        '&destinations=' + destination +
                        '&key=AIzaSyB087vg5c4hTnohVi4sjP63cHv4Eh3jt2s', function (error, response, body) {
                        //Check for error
                        if (error) {
                            return console.log('Error:', error);
                        }

                        //Check for right status code
                        if (response.statusCode !== 200) {
                            return console.log('Invalid Status Code Returned:', response.statusCode);
                        }
                        //All is good. Print the body
                        body = JSON.parse(body);

                        //Extracting relevant information based on the API's formatted JSON file
                        var loc = body.rows[0].elements; //first item of rows in JSON file
                        for (var i = 0; i < loc.length; i++) {
                            result.location.push({
                                'distance': loc[i].distance.text,
                                'duration': loc[i].duration.text.toString()
                            });
                        }

                        //Convert the array into a JSON object that will be passed to res.write()
                        //and ultimately the JQuery method in index2.html
                        JSONResult = JSON.stringify(result);

                        for (var i = 0; i<result.location.length; i++){
                            console.log("\nThe Distance is: " + result.location[i].distance);
                            console.log("\nThe Time is: " + result.location[i].duration);
                        }
                        res.write(JSONResult);
                        res.end();
                    });

                });
            }
        case '/copytoLocal':
            if (req.method === 'POST') {
                res.writeHead(200, {'Content-Type': 'text/html'});
                console.log("in copy to local");
                // destination.txt will be created or overwritten by default.
                fs.copyFile('source.txt', 'destination.txt', (err) => {
                    if (err) throw err;
                    console.log('source.txt was copied to destination.txt');
                });
                res.write("hello");
                res.end();
            }
            break;


        //If other files are requested other than the index2.html,
        // open those files instead (NOT RECOMMENDED)
        default:
            console.log("IN DEFAULT ROUTE");
            fs.readFile(pathname.substr(1), function (err, data) {
                if (err) {
                    console.log(err);
                    // HTTP Status: 404 : NOT FOUND
                    // Content Type: text/plain
                    res.writeHead(404, {'Content-Type': 'text/html'});
                }else {
                    //Page found
                    // HTTP Status: 200 : OK
                    // Content Type: text/plain
                    if (pathname.substr(1)== "index.html"){

                    }
                    res.writeHead(200, {'Content-Type': 'text/html'});

                    // Write the content of the file to response body
                    res.write(data.toString());
                }
                // Send the response body
                res.end();
            });

    }
    // Read the requested file content from file system

}).listen(port);
console.log('Client Server running at http://127.0.0.1:8080/');