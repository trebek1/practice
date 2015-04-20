var express = require('express');
var app = express();
var request = require('request');
var db = require('./models');
var bodyParser = require('body-parser');
var session = require('express-session');
var methodOverride = require('method-override');

app.set("view engine", "ejs");	
// This defines req.session
app.use(session({
	secret: "I'm very very secret thing",
	resave: false,
	save: {
		uninitialize: true
	}
}));

app.use("/", function(req,res,next) {
	req.login = function(user) {
		req.session.userId = user.id;
	};
	req.currentUser = function() {
		return db.User.find(req.session.userId)
		         .then(function(dbUser) {
		         	req.user = dbUser;
		         	return dbUser;
		         });
	};
	req.logout = function() {
		req.session.userId = null;
		req.user = null;
	};
	next();
});

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));


app.get('/', function(req,res){
	

	res.render("index", {blue: "Some Title"});
});

app.listen(3000, function(){
	console.log("WE READY");
});






