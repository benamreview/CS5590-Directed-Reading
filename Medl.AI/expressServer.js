/**
 * Created by Marmik on 04/10/2016.
 */
var express = require('express');
var app = express();
var formidable = require('formidable');
var fs = require('fs');
var process = require('process');
//main temp folder
var mainFolder = __dirname + "/tmp";
//timestamp variable to make folders unique by ID
var currentTime;
app.set('view engine', 'html');
//***************************************//
// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/database");
//***********************************//
//This body-parser module parses the JSON, buffer, string and url encoded data submitted
// using HTTP POST request.
//Install body-parser using NPM as shown below.
var bodyParser = require("body-parser");
//This is used to load static files such as css, fonts, img, and js files.
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
var nodeComments = require('node-comments');
    nodeComments.init({
        mongodb: false,         // -> Not yet implemented
        angular: false,         // -> Not yet implemented
        dbpath:  'tmp/EnlargenHeart/testcase-1552231986206/comments-data.js'           // node-comments only works with files for now, this option defines
                                // the directory where to find them.
    });
app.use('/node-comments', nodeComments.routes);


/*
*
*
* Authentication With Firebase
*
*
*
* */
var firebaseConfig = {
    apiKey: "AIzaSyAz7DBKf9tXXevwGIb08IJLwGC4vSlAir0",
    authDomain: "cs5597-directed-reading.firebaseapp.com",
    databaseURL: "https://cs5597-directed-reading.firebaseio.com",
    projectId: "cs5597-directed-reading",
    storageBucket: "cs5597-directed-reading.appspot.com",
    messagingSenderId: "172359783153"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log("User is valid");
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        // ...
    } else {
        // User is signed out.
        // ...
    }
});
/*
*
*
*
* */
app.get("/", function(req, res)
{
    console.log('here');
    res.sendFile("index.html", {"root": __dirname});
});
app.get("/loadProject", loadProject);
app.post("/signup", function (req, res){
    var fname = req.body.fname;
    var lname = req.body.lname;
    var email = req.body.email;
    var password = req.body.password;
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function() {
            var user = firebase.auth().currentUser;
            return user.updateProfile({
                displayName: fname + " " + lname
            })
        })
        .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        res.writeHead(401, {'Content-Type': 'application/json'});
        res.write("Error Signing Up");
        res.end();
        // ...
    });
    console.log("Continue with sign in code");
    var user = firebase.auth().currentUser;
    if (user != null){
        var displayName = user.displayName;
        var email = user.email;
        console.log("Current Logged-in User: "  + displayName);
        res.writeHead(200, {'Content-Type': 'application/json'});
        var result = {
            username : displayName,
            email: email
        };
        JSONResult = JSON.stringify(result);
        res.write(JSONResult);
        res.end();
    }
});
app.post("/signout", function (req, res){
    console.log('in signout()');
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        res.writeHead(200, {'Content-Type': 'application/json'});
        JSONResult = JSON.stringify("done");
        res.write(JSONResult);
        res.end();
    }, function(error) {
        // An error happened.
        res.writeHead(500, {'Content-Type': 'application/json'});
        JSONResult = JSON.stringify("error");
        res.write(JSONResult);
        res.end();
    });
});
app.post("/signin", function (req, res){
    var email = req.body.email;
    var password = req.body.password;
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        // ...
        res.writeHead(401, {'Content-Type': 'application/json'});
        res.write("Error Signing Up");
        res.end();
    })
        .then(function() {
            var user = firebase.auth().currentUser;
            if (user != null){
                var displayName = user.displayName;
                var email = user.email;
                console.log("Current Logged-in User: "  + displayName);
                res.writeHead(200, {'Content-Type': 'application/json'});
                var result = {
                    username : displayName,
                    email: email
                };
                JSONResult = JSON.stringify(result);
                res.write(JSONResult);
                res.end();
            }
        });

});
function getCurrentUserInfo(){
    var user = firebase.auth().currentUser;
    if (user != null){
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        console.log("Current Logged-in User: "  + displayName);


    }
    else {
        console.log("User is not logged in");

    }
}
app.post("/getuserinfo", function (req, res){
    var user = firebase.auth().currentUser;
    if (user != null){
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        console.log("Current Logged-in User: "  + displayName);
        res.writeHead(200, {'Content-Type': 'application/json'});
        var result = {
            username : displayName,
            email: email
        };
        JSONResult = JSON.stringify(result);
        res.write(JSONResult);
        res.end();
    }
    else {
        console.log("User is not logged in");
        res.writeHead(200, {'Content-Type': 'application/json'});
        JSONResult = JSON.stringify("no");
        res.write(JSONResult);
        res.end();
    }
});
app.post("/getDescription", function (req, res){
    var pName = req.body.pname;
    var projectPath = mainFolder + '/' + pName;
    console.log(req.body);
    fs.readFile(projectPath + '/info.txt', function(err, data) {
        if (err) throw err;
        //var array = data.toString().split("\n");
        var res2 = {};
        res2.description = data.toString();
        res.writeHead(200, {'Content-Type': 'application/json'});
        JSONResult = JSON.stringify(res2);
        console.log(JSONResult);
        res.write(JSONResult);
        res.end();
    });
});
app.post('/latest-cases', function (req, res) {
    var pName = req.body.pname;
    //console.log(req.body.pname);
    const testFolder = './tmp/' + pName + '/';
    var result={
        'image': []
    };
    process = require('process');
    process.chdir(__dirname);
    fs.readdir(testFolder, (err, files) => {
        console.log(testFolder);
        console.log(files);
        if (files !== undefined){
            files.forEach(file => {
                //console.log(file);
                if (file.toString().includes('testcase')){
                    result.image.push({
                        'name': file,
                        'path': mainFolder + '/' + file + '/newHeart.jpeg',
                        'date': fs.statSync(testFolder + '/' + file).mtime,
                    });
                }

            });
        }
        result = get3latestcases(result.image);
        for (var i = 0; i < 3; i++){
            console.log("i = " + i);
            if (result.image[i]!=null){
                var testcaseURL = testFolder + result.image[i].name;
                result.image[i].path = findImageName(testcaseURL);
                result.image[i].date = parseDate(result.image[i].date);
            }

        }
        console.log(result);
        res.writeHead(200, {'Content-Type': 'application/json'});
        JSONResult = JSON.stringify(result);
        //console.log(JSONResult);
        res.write(JSONResult);
        res.end();

    });
});
function parseDate(str){
    var originalDate = str.toString();
    var parsedDate = originalDate.slice(0, originalDate.indexOf('GMT'));
    return parsedDate;
}
function findImageName (testcaseURL){
    var files = fs.readdirSync(testcaseURL);
    console.log("In findImageName()");
    console.log(testcaseURL);
    console.log(files.length);
    console.log(files);
    for (var i=0; i<files.length;i++){
        console.log(files[i]);
        if (files[i].toString().includes('.png') || files[i].toString().includes('.jpeg') || files[i].toString().includes('.jpg')){
            console.log("returned img name: " + files[i]);
            return testcaseURL + '/' + files[i];
        }
    }
    return "cannot be found";
}
function get3latestcases (imgArr){
    var result={
        'image': []
    };
    console.log("Number of Test Cases: " + imgArr.length);
    for (i=0;i<3;i++){
        if (imgArr.length!=0) {
            var mostRecentDate = new Date(Math.max.apply(null, imgArr.map(e => {
                return new Date(e.date);
            })));
            var mostRecentObject = imgArr.filter(e => {
                var d = new Date(e.date);
                return d.getTime() == mostRecentDate.getTime();
            })[0];
            var index = imgArr.map(function (img) {
                return img.name;
            }).indexOf(mostRecentObject.name);
            console.log("most recent index: " + index);
            console.log("MOST RECENT TEST CASE: " + mostRecentObject.name);

            //Add this object to the result array
            result.image.push(mostRecentObject);

            //Remove the latest from the current img array
            imgArr.splice(index, 1);
        }
    }
    return result;

}
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
                    'path': mainFolder + '/' + file + '/Results.html',
                    'description': "",
                    'fullname': ""
                });
            });
        }
        for (i=0; i< result.project.length; i++){
            var projectPath = mainFolder + '/' + result.project[i].name;
            var str = fs.readFileSync(projectPath + "/info.txt").toString();
            var str2 = fs.readFileSync(projectPath + "/name.txt").toString();
            result.project[i].description = str;
            result.project[i].fullname = str2;
            console.log(str);


        }
        console.log(result);
        res.writeHead(200, {'Content-Type': 'application/json'});
        JSONResult = JSON.stringify(result);
        //console.log(JSONResult);
        res.write(JSONResult);
        res.end();
        console.log(result);

    });
});

function loadProject(req, res) {

    // // Use child_process.spawn method from
    // // child_process module and assign it
    // // to variable spawn
    var projectName = req.query.id;
    var imgName = req.query.imgname;
    var imgPath = "./" + currentTime + "/" + req.query.imgname;
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
    process.chdir(mainFolder + '/' + projectName);
    process = spawn('python',["predict.py", imgPath]);
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

        // res.writeHead(200, {'Content-Type': 'text/plain'});
        // res.write(result);
        // res.end();
        ///Returns JSON file based on the text file output (predictions.txt)
        var localtmpURL = mainFolder + '/' + projectName + '/' + currentTime + "/" ;
        ///Copy files over
        var oldpath = mainFolder + '/' + projectName + '/' + 'predictions.txt';
        var newpath = localtmpURL + 'predictions.txt';
        fs.rename(oldpath, newpath, function (err) {
            if (err) {
                console.log(err);
                // res.writeHead(500, {'Content-Type': 'text/html'});
                // res.sendFile("404.html", {"root": __dirname});
                res.status(500);
                res.send('None shall pass');
            }
            else{
                fs.readFile(newpath, function(err, data) {
                    if (err) throw err;
                    //var array = data.toString().split("\n");
                    var str = data.toString();
                    str = str.substr(1,str.length-2);
                    var result = str.split(", ");
                    var res2 = [];
                    res2.push({
                        "testcaseNum" : currentTime,
                        "projectName" : projectName,
                        "imgName" : imgName
                    });
                    console.log(res2);
                    for (i=0;i<result.length;i+=2)
                    {
                        //console.log(res[i][res[i].length-2] + res[i][res[i].length-1]);
                        result[i]=result[i].substr(2,result[i].length-3);
                        result[i+1] = result[i+1].substr(0,result[i+1].length-1);
                        console.log(result[i]);
                        console.log(result[i+1]);
                        res2.push({"classname" : result[i],
                                "value": result[i+1]
                            }
                        )
                    }

                    console.log(res2);
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    JSONResult = JSON.stringify(res2);
                    console.log(JSONResult);
                    res.write(JSONResult);
                    res.end();
                });
                console.log('end of output');
            }

        });


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
        currentTime = "testcase-" + Date.now();
        var localtmpURL = mainFolder + '/' + pName + "/" + currentTime + "/";
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

         var rd = fs.createReadStream(mainFolder + '/' + pName + "/" + "comments-data.js");
          var wr = fs.createWriteStream(localtmpURL + "comments-data.js");
          return new Promise(function(resolve, reject) {
            rd.on('error', reject);
            wr.on('error', reject);
            wr.on('finish', resolve);
            rd.pipe(wr);
          }).catch(function(error) {
            rd.destroy();
            wr.end();
            throw error;
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
