/**
 * Created by Marmik on 04/10/2016.
 */
var express = require('express');
var app = express();
var request = require('request');
var formidable = require('formidable');
var fs = require('fs');
//this global variable will be used to store the Java Program arguments
var args = "junit ";
var mainFolder = 'C:\\Users\\hoang\\Documents\\GitHub\\CS5590-Directed-Reading\\Code2Graph\\UIDev\\templatemo_503_newline\\templatemo_503_newline\\tmp';
app.set('view engine', 'html');
//This body-parser module parses the JSON, buffer, string and url encoded data submitted
// using HTTP POST request.
//Install body-parser using NPM as shown below.
var bodyParser = require("body-parser");
//This is used to load static files such as css, fonts, img, and js files.
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", function(req, res)
{
    res.sendFile("index.html", {"root": __dirname});
});
app.get("/loadProject", function(req, res)
{
    console.log(req.query.id);
    var projectName = req.query.id;
    res.sendFile("Results.html", {"root": __dirname + "\\tmp\\" + projectName });
});
app.post('/pArchive', function (req, res) {
    const testFolder = './tmp/';
    var result={
        'project': []
    };
    fs.readdir(testFolder, (err, files) => {
        files.forEach(file => {
            //console.log(file);
            result.project.push({
                'name': file,
                'path': mainFolder + '\\' + file + '\\Results.html'
            });
        });
        res.writeHead(200, {'Content-Type': 'application/json'});
        JSONResult = JSON.stringify(result);
        //console.log(JSONResult);
        res.write(JSONResult);
        res.end();
    })


});
app.post('/fileupload', function (req, res) {
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
        console.log(files.filetoupload[0].path);
        //This local temporary folder will be used to store the selected jar files
        var pName = fields.pname.toString();
        if (pName == ""){
            pName = "project1";
        }
        else {
            pName = pName.replace(/\s+/g, '');
        }
        var localtmpURL = 'C:\\Users\\hoang\\Documents\\GitHub\\CS5590-Directed-Reading\\Code2Graph\\UIDev\\templatemo_503_newline\\templatemo_503_newline\\tmp\\' + pName + "\\";
        var filestoupload = files.filetoupload;
        var filenumLeft = filestoupload.length;

        args += filenumLeft + ' ';
        //Create a path if not exists
        //var dir = 'C:/Users/hoang/Documents/GitHub/CS5551-Team7-1-ICP/ICP-10/Source-Code/tmp/';

        if (!fs.existsSync(localtmpURL)){
            fs.mkdirSync(localtmpURL);
        }
        ///Copy files over
        for (var i = 0; i < filestoupload.length; i++)
        {

            args += localtmpURL + filestoupload[i].name + ' ';
            var oldpath = filestoupload[i].path;
            var newpath = localtmpURL + filestoupload[i].name;
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
        console.log(args);
        args += ' ' + pName;
        //Call Java Program to process the uploaded files
        var exec = require('child_process').exec, child;
        child = exec('java -jar JavaCallGraphVJ.jar ' + args,
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
                    //Reset the program arguments
                    args = "junit ";
                    // Send the response body
                    res.end();
                });
                console.log('stderr: ' + stderr);
                if(error !== null){
                    console.log('exec error: ' + error);
                }
            });
    });

});
app.get('/test', function(req, res, next) {
    res.json({ message: 'Hello World' });
});
var port = process.env.PORT || 8080;
var server = app.listen(port, function () {
    // var host = server.address().address
    var port = server.address().port;

    console.log("Distance App currently listening at http://127.0.0.1:%s",port)
})