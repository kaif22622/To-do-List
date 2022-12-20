const express = require('express')
const app = express()
const session = require('express-session')
// interact with local file system (using promisses not callbacks)
// const fs = require('node:fs/promises');
const port = 3006

app.use(express.json());       
app.use(express.static("resources"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + '/resources'));
app.use(session({secret: "csci4131", saveUninitialized:true, resave: false}));

app.set("views", "templates");
app.set("view engine", "pug");

app.get("/", (req, res) => {
    res.redirect("/reminders");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

var db = require("./mydb");

// get list
app.get('/reminders', async function(req, res) {
    const done = req.query.done;
    const priority = req.query.priority;
    var rows = [];
    var list = await db.getList(done, priority);
    if (list) {
        for (var i = 0; i < list.length; i++) {
            var row = {
                id: list[i].id,
                priority: list[i].priority,
                message: list[i].message,
                done: list[i].done
            }
            rows.push(row);
        }
        res.render('reminders.pug', {empty: false, error: false, rows: rows});
    }
    else if (list == undefined) {
        res.render('reminders.pug', {error: true});
    }
    else if (list.length == 0) {
        res.render('reminders.pug', {empty: true});
    } 
});

// add list
app.post('/reminders', async function(req, res) {
    const submit = req.body.submit;
    const priority = req.body.priority;
    if(submit === 'Submit') {
        const message = req.body.message;
        try {
            await db.addList(message, false, priority);
            res.redirect('/');
        } catch {
            console.log("error");
        }
    }    
});  

// delete list
app.post("/api/list/:id", async function(req, res){
    const id = req.params.id;
    await db.deleteList(id);
    res.redirect('/');
})

// mark list
app.post("/api/mark/:id/:done", async function(req, res){
    const id = req.params.id;
    const done = req.params.done;
    await db.updateList(id, done);
    res.redirect('/');
})


app.get("/login", (req, res)=>{
    if (req.session.username) {
      req.session.loggedIn = false;
      res.render('logout.pug', {h1:  "Hi " + req.session.username});
    }
    else
      res.render('login.pug');
  });
  
app.post('/login', (req, res) => {
    req.session.loggedIn = true;
    username = req.body.username;
    req.session.username = username;
    res.redirect("/reminders");
});

app.listen(port, function() {
    console.log(`Example app listening on port ${port}`)
})