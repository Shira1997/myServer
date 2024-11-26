const express = require('express')
const app = express()

const mysql = require('mysql')

const dbconn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'myServer'
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));
app.set('view engine', 'ejs');

// const express = require('express-session');
const session = require('express-session');

app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 6000
    }
}));



app.get('/', (req, res) => {
    res.send('hello')
})

app.get('/showlist', (req, res) => {
    if(!req.session.isLoggedIn){
        res.redirect('/login.html');
    }else{
        const sql = "SELECT * FROM `data`";
        dbconn.query(sql, (err, result) => {
            if (err) throw err;
            console.log(result);
            res.send(result);
    
        })
    }
    })

// app.get('/showlist', (req, res) => {
//     const sql = "SELECT * FROM `data`";
//     dbconn.query(sql, (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         res.send(result);

//     })
// })


app.get('/insert', (req, res) => {
    const name = req.query.name;
    const username = req.query.username;
    const email = req.query.email;
    const password = req.query.password;
    const grade = req.query.grade;
    const sql = "INSERT INTO `data`(`name`, `username`, `email`, `password`, `grade`) VALUES (?,?,?,?,?)";
    dbconn.query(sql,[name, username, email, password, grade], (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('<h1>sucsion added name ' + name+" </h1>");

    })
})


app.post('/login', (req, res) => {
    console.log(req);
    let user = req.body.username;
    let password = req.body.password;
    console.log(user + " " + password);

    const query = 'SELECT * FROM data WHERE Username = ? AND Password = ?';
    dbconn.query(query, [user, password], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            req.session.isLoggedIn = true;
            res.redirect('/afterLogin.html');
        } else {
            res.send(`<h1>Invalid username or password</h1><br/><a href="/login.html">Back to Login</a>`);
        }
    });
});



app.listen(3000, () => {
    console.log('server is running port 3000')
})