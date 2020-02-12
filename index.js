//import express module 
var express = require('express');
//create  an express app
var app = express();
//require express middleware body-parser
var bodyParser = require('body-parser');
//require express session
var session = require('express-session');
var cookieParser = require('cookie-parser');

//set the view engine to ejs
app.set('view engine', 'ejs');
//set the directory of views
app.set('views', './views');
//specify the path of static directory
app.use(express.static(__dirname + '/public'));

//use body parser to parse JSON and urlencoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//use cookie parser to parse request headers
app.use(cookieParser());
//use session to store user data between HTTP requests
app.use(session({
    secret: 'cmpe_273_secure_string',
    resave: false,
    saveUninitialized: true
}));

//Only user allowed is admin
var Users = [{
    "username": "admin",
    "password": "admin"
}];
//By Default we have 3 books
var books = [
    { "BookID": "1", "Title": "Book 1", "Author": "Author 1" },
    { "BookID": "2", "Title": "Book 2", "Author": "Author 2" },
    { "BookID": "3", "Title": "Book 3", "Author": "Author 3" }
]
//route to root
app.get('/', function (req, res) {
    //check if user session exits
    if (req.session.user) {
        console.log("going to home page")
        console.log(req.session.user)
        res.redirect('/home');
    } else
{
    var errors="";
        res.render('login'
        ,
        {
          errors:errors  
        }
        );
    }
});

app.post('/login', function (req, res) {
    if (req.session.user) {
        res.redirect('/home');
    } else {
        console.log("Inside Login Post Request");
        console.log("Req Body : ", req.body);
        Users.filter(user => {
            if (user.username === req.body.username && user.password === req.body.password) {
                req.session.user = user;
                res.redirect('/home');
            }
            else
            {
                var errors="Invalid credentials. Try again"
                res.render('login'
                ,
                {
                  errors:errors  
                }
                )
            }

        });
    }                                                                                                                                                                                                                                                                                 

});

app.get('/home', function (req, res) {
    if (!req.session.user) {
        res.redirect('/');
    } 
    
    else {
        console.log("Session data : ", req.session);
        res.render('home', {
            books: books
        });
    }
});

app.get('/create', function (req, res) {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        res.render('create',{
        errors:""
        });
    }
});

app.post('/create', function (req, res) {
    if (!req.session.user) {
        res.redirect('/');
    }
    else {
        console.log(req.body.author)

        var hasId = books.find(book => {
            return book.BookID === req.body.bookid;
        });
        if (!hasId) {
            var book = {
                BookID: req.body.bookid,
                Title: req.body.title,
                Author: req.body.author
            }
            books.push(book);

            //console.log(books)
            res.redirect('/home');
        }
        else {
            var errors="Book Id already exists"
            res.render('create',
            {
                errors:errors
            })
        }
    }
});

app.get('/delete', function (req, res) {
    console.log("Session Data : ", req.session.user);
    if (!req.session.user) {
        res.redirect('/');
    } else {
        res.render('delete', {
            books: books,
            errors: ""
        });
    }
});

app.post('/delete', function (req, res) {
    // add your code here

    console.log(req.body.deleteId)
    if (!req.session.user) {
        res.redirect('/');
    }
    else {

        if (books.findIndex(book => book.BookID === req.body.deleteId) !== -1) {
            console.log("here")
            console.log(books.findIndex(book => book.BookID === req.body.deleteId))
            books.splice(books.findIndex(book => book.BookID === req.body.deleteId), 1)
            res.redirect('/home')
        }
        else {
            // res.status(409).json({error: "Username already exists"});
            var errors = "Book Id doesn't exists"
            res.render('delete', {
                errors: errors,
                books: books,
            });
        }

    }

})

var server = app.listen(3000, function () {
    console.log("Server listening on port 3000");
});