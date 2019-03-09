/**
 * Created by Marmik on 04/10/2016.
 */
var express = require('express');
var app = express();
var formidable = require('formidable');
var fs = require('fs');
var process = require('process');
//main temp folder
var mainFolder = __dirname + "\\tmp";
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
    console.log('here');
    res.sendFile("index.html", {"root": __dirname});
});
app.get("/loadProject", loadProject);

app.post('/pArchive', function (req, res) {
    const testFolder = './tmp/';
    var result={
        'project': []
    };
    process = require('process');
    process.chdir(__dirname);
    fs.readdir(testFolder, (err, files) => {
        console.log(testFolder);
        console.log(files);
        if (files !== undefined){
            files.forEach(file => {
                console.log(file);
                result.project.push({
                    'name': file,
                    'path': mainFolder + '\\' + file + '\\Results.html'
                });
            });
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        JSONResult = JSON.stringify(result);
        //console.log(JSONResult);
        res.write(JSONResult);
        res.end();
    })


});


function loadProject(req, res) {

    // // Use child_process.spawn method from
    // // child_process module and assign it
    // // to variable spawn
    var projectName = req.query.id;
    var imgName = req.query.imgname;
    console.log(imgName);
    var spawn = require("child_process").spawn;
    //
    // // Parameters passed in spawn -
    // // 1. type_of_script
    // // 2. list containing Path of the script
    // //    and arguments for the script
    //
    // // E.g : http://localhost:3000/name?firstname=Mike&lastname=Will
    // // so, first name = Mike and last name = Will
    // // var process = spawn('python',["./tmp/EnlargenHeart/predict.py",
    // //     req.query.id,
    // //     req.query.id] );

    var result = "Result: \n";
    process = require('process');
    process.chdir(mainFolder + '\\' + projectName);
    process = spawn('python',["predict.py", imgName]);
    const chunks = [];
    // Takes stdout data from script which executed
    // with arguments and send this data to res object
    process.stdout.on('data', function(data) {
        //res.writeHead(200, {'Content-Type': 'text/plain'});
        result += data.toString();
        chunks.push(data);
        //JSONResult = JSON.stringify(data.toString());
        console.log("Result:" + data.toString());
        //res.send(data);

    } );
    process.stdout.on('end', function() {

        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write(result);
        res.end();
        console.log('end of output');

    } );
    process.stderr.on('data', function(data){
        //res.writeHead(500, {'Content-Type': 'text/html'});
        //result += data;
        console.log("Error: " + data);
    });
    // res.write(result, function(err) { res.end(); });
}
app.post('/fileupload', function (req, res) {
    var form = new formidable.IncomingForm(),
        files = [],
        fields = [];
    form.multiples = true;
    form.on('field', function(field, value) {
        console.log("field");
        console.log(field);
        fields.push([field, value]);
    });
    form.on('file', function(field, file) {
        console.log("field and file")
        console.log(field);
        console.log(file.name);
        files.push([field, file]);
    });
    form.on('end', function() {
        console.log('-> upload done');
    });
    form.parse(req, function (err, fields, files) {
        console.log(files.filetoupload.path);
        //This local temporary folder will be used to store the selected jar files
        var pName = fields.pname.toString();
        if (pName == ""){
            pName = "project1";
        }
        else {
            pName = pName.replace(/\s+/g, '');
        }
        var localtmpURL = mainFolder + '\\' + pName + "\\";
        console.log(localtmpURL);
        var filestoupload = files.filetoupload;

        //Create a path if not exists
        if (!fs.existsSync(localtmpURL)){
            fs.mkdirSync(localtmpURL);
        }
        ///Copy files over
        var oldpath = filestoupload.path;
        var newpath = localtmpURL + filestoupload.name;
        fs.rename(oldpath, newpath, function (err) {
            if (err) {
                console.log(err);
                // res.writeHead(500, {'Content-Type': 'text/html'});
                // res.sendFile("404.html", {"root": __dirname});
                res.status(500);
                res.send('None shall pass');
            }
            else{
                res.status(200);
                res.send('upload done');
            }

        });

    });

});

var port = process.env.PORT || 8080;
var server = app.listen(port, function () {
    // var host = server.address().address
    var port = server.address().port;

    console.log("Distance App currently listening at http://127.0.0.1:%s",port)
});
//hello
