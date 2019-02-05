var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var url = require('url');
const { parse } = require('querystring');
http.createServer(function (req, res) {
    var pathname = url.parse(req.url).pathname;
    if (req.url == '/testpage'){
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
    }
    //Main Route for FileUpload
    else if (req.url == '/fileupload') {
        var form = new formidable.IncomingForm(),
            files = [],
            fields = [];
        form.multiples = true;
        form.on('field', function(field, value) {
            console.log(field);
            fields.push([field, value]);
        })
        form.on('file', function(field, file) {
            console.log(field);
            console.log(file.name);
            files.push([field, file]);
        })
        form.on('end', function() {
            console.log('-> upload done');
            //res.writeHead(200, {'content-type': 'text/plain'});
            //res.write('received fields:\n\n '+util.inspect(fields));
            //res.write('\n\n');
            //res.end('received files:\n\n '+util.inspect(files));
        });
        //form.parse(req);
        form.parse(req, function (err, fields, files) {
            console.log("hello");
            console.log(files.filetoupload[0].path);
            var filestoupload = files.filetoupload;
            var filenumLeft = filestoupload.length;
            //Create a path if not exists
            var dir = 'C:/Users/hoang/Documents/GitHub/CS5551-Team7-1-ICP/ICP-10/Source-Code/tmp/';

            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
            }
            ///Copy files over
            for (var i = 0; i < filestoupload.length; i++)
            {
                console.log(filestoupload[i].name);
                var oldpath = filestoupload[i].path;
                var newpath = 'C:/Users/hoang/Documents/GitHub/CS5551-Team7-1-ICP/ICP-10/Source-Code/tmp/' + filestoupload[i].name;
                fs.rename(oldpath, newpath, function (err) {
                    if (err) throw err;
                    if(--filenumLeft == 0){
                        //res.writeHead(200, {'Content-Type': 'text/html'});
                        //res.write('All files have been uploaded!');
                        //res.write(newpath);
                        //res.end();
                    }
                });
            }
            //Call Java Program to process the uploaded files
            var localtmpURL = 'C:\\Users\\hoang\\Documents\\GitHub\\CS5551-Team7-1-ICP\\ICP-10\\Source-Code\\tmp\\';
            var exec = require('child_process').exec, child;
            child = exec('java -jar JavaCallGraphVJ.jar ' + 'junit 5 ' + localtmpURL+'junit-4.3.jar ' + localtmpURL+'junit-4.5.jar ' + localtmpURL+'junit-4.7.jar ' + localtmpURL+'junit-4.9.jar',
                function (error, stdout, stderr){
                    console.log('stdout: ' + stdout);
                    result = stdout;
                    fs.readFile(localtmpURL + 'Results.html', function (err, data) {
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
                    console.log('stderr: ' + stderr);
                    if(error !== null){
                        console.log('exec error: ' + error);
                    }
                });
        });

    }
    else if (req.url == '/addnum'){
        //////////////////////////////////////////////
        res.writeHead(200, {'Content-Type': 'application/json'});
        //These are the necessary variables for server to call the Google Distance Matrix API
        //These will be updated as soon as user has an input
        let resultBody ={
            'num1': "",
            'num2': ""
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
                resultBody.num1 = parse(body).num1;
                resultBody.num2 = parse(body).num2;
                console.log("first num:");
                console.log(
                    parse(body).num1
                );
                console.log(
                    parse(body).num2
                );
                //These are user's input which will be substituted into the API request
                var num1 = resultBody.num1;
                var num2 = resultBody.num2;
                var result = "";
                /////Execute child process for Addition Program
                /*var exec = require('child_process').exec, child;
                child = exec('java -jar AdditionProgram.jar ' + num1  + ' ' + num2,
                    function (error, stdout, stderr){
                        console.log('stdout: ' + stdout);
                        result = stdout;
                        res.write(result);
                        res.end();
                        console.log('stderr: ' + stderr);
                        if(error !== null){
                            console.log('exec error: ' + error);
                        }
                    });*/
                var localtmpURL = 'C:\\Users\\hoang\\Documents\\GitHub\\CS5551-Team7-1-ICP\\ICP-10\\Source-Code\\tmp\\';

                var exec = require('child_process').exec, child;
                child = exec('java -jar ' + localtmpURL + 'JavaCallGraphVJ.jar ' + 'junit 5 ' + localtmpURL+'junit-4.3.jar ' + localtmpURL+'junit-4.5.jar ' + localtmpURL+'junit-4.7.jar ' + localtmpURL+'junit-4.9.jar',
                    function (error, stdout, stderr){
                        console.log('stdout: ' + stdout);
                        result = stdout;
                        fs.readFile('Results.html', function (err, data) {
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
                            console.log('stderr: ' + stderr);
                        if(error !== null){
                            console.log('exec error: ' + error);
                        }
                    });
                    //Convert the array into a JSON object that will be passed to res.write()
                    //and ultimately the JQuery method in index2.html

                });
        }


    }
    else {
        console.log("IN DEFAULT ROUTE");
        fs.readFile(pathname.substr(1), function (err, data) {
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
}).listen(8080);