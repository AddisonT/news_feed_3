var express = require('express');
var bodyParser = require('body-parser');
var pg = require("pg");
var methodOverride = require("method-override");

var app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// Refactor connection and query code
var db = require("./models");

app.use(express.static(__dirname+'/css'));

app.get('/articles', function(req,res) {
	db.article.findAll()
    .then(function (articles) {
      res.render("articles/index", {articlesList: articles});
    });
});

app.get('/articles/new', function(req,res) {
  		res.render('articles/new');
});

app.post('/articles', function(req,res) {
	db.article.create(req.body.article).then(function(){
		console.log(req.body);
  		res.redirect('/articles');
	});
});

app.get('/articles/:id', function(req, res) {
	db.article.find(req.params.id).then(function(art){
  		res.render('articles/article', {art: art,id: req.params.id });
 	});
});

app.get('/articles/:id/edit', function(req,res) {
		db.article.find(req.params.id).then(function(art){
  			res.render('articles/edit', {art: art,id: req.params.id});
		});
});

app.put('/articles/:id', function(req,res) {
	db.article.find(req.params.id)
	.then(function(art){
		art.updateAttributes({
			title: req.body.article.title,
			author: req.body.article.author,
			content: req.body.article.content
		});
 		res.redirect('/articles');
    });
});

app.get('/', function(req,res) {
  res.render('site/index.ejs');
});

app.get('/about', function(req,res) {
  res.render('site/about');
});

app.get('/contact', function(req,res) {
  res.render('site/contact');
});

app.delete('/articles/:id',function(req,res){
	db.article.find(req.params.id)
	.then(function(art) {
		art.destroy().then(function(){
			res.redirect('/articles');
		});
  });

});

app.listen(3000, function() {
  console.log('Listening');
});
