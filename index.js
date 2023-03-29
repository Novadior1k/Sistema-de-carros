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

// creating database connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'Xoxo7378',
  database: 'localiza',
  port: 3306,
});

// handle errors in database queries
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

app.get('/', (req, res) => {
  res.render('home', { title: 'Express' });
});

app.post('/conn/dashes', (req, res) => {
  const email = req.body.email;
  const senha = req.body.senha;
  const telefone = req.body.telefone;
  const name = req.body.name;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database', err);
      res.status(500).send('Internal server error');
      return;
    }
    

    const sql = "INSERT INTO clientes (nome, senha, telefone, email) VALUES (?, ?, ?, ?)";
    connection.query(sql, [name, senha, telefone, email], (error, results) => {
      connection.release(); // release the connection
      if (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          // Handle duplicate entry error
          console.error('Duplicate entry');
        } else {
          // Handle other errors
          console.error(error);
        }
      } else {
        // Insertion successful
        console.log('New user inserted');
      }
    });
  });
  res.render('logged', { title: 'Express' });
});

app.listen(port, () => {
  console.log(`Website rodando no link http://localhost:${port}`);
});

