const express = require('express');
const app = express();
const port = 3000;
const expbh = require('express-handlebars');
const path = require('path');
const mysql = require('mysql');

// views and webpages

app.engine('handlebars', expbh.engine());
app.set('view engine', 'handlebars');
app.use('/public', express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render('home', { title: 'Express' });
});


// end of views and webpages

// creating database connection 
app.post('/login', (req, res) => {
    const email = req.body.email;
    const senha = req.body.senha;
    const telefone = req.body.telefone;
    const name = req.body.name;
  
    // creating database connection
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'localiza'
    });
  
    // connecting to the database
    connection.connect((error) => {
      if (error) {
        console.log("Error connecting to database!");
      } else {
        console.log("Connected to database!");
  
        // inserting data into the table clientes
        const sql = "INSERT INTO clientes (email, senha, telefone, name) VALUES (?, ?, ?, ?)";
        connection.query(sql, [email, senha, telefone, name], (error, results) => {
          if (error) {
            console.log("Error inserting data into clientes table!");
          } else {
            console.log("Data inserted successfully into clientes table!");
          }
        });
  
        // closing the database connection
        connection.end();
      }
    });
  
    res.send('Cadastro com sucesso');
});




app.listen(port, () => {
    console.log(`Website rodando no link http://localhost:${port}`);
});