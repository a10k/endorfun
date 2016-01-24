/**
 * Endorfun Game !
 *
 *
 * written by alok pepakayala (c)
 * 
 * Copyright(c) 2016 
 * a10k@icloud.com
 */


var express = require("express");
var app = express();
app.enable('trust proxy');
app.use(express.static(__dirname + '/'));


app.post('/', function(req, res) {
	res.redirect("index.html");
});

// Listeners
 var port = process.env.PORT || 8080;
 app.listen(port, function() {
    console.log("Listening on " + port);
 });



console.log("Endorfun  Game \nALOK PEPAKAYALA");