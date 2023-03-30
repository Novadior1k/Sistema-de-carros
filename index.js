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
//Main page where the user can register
app.get('/', (req, res) => {
  res.render('home', { title: 'Express' });
});
//Where the client is registered POST METHOD
app.post('/clientes', (req, res) => {
  const email = req.body.email;
  const endereco = req.body.endereco;
  const telefone = req.body.telefone;
  const name = req.body.name;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database', err);
      res.status(500).send('Internal server error');
      return;
    }
    

    const sql = "INSERT INTO clientes (nome, endereco, telefone, email) VALUES (?, ?, ?, ?)";
    connection.query(sql, [name, endereco, telefone, email], (error, results) => {
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
  res.render('home', { title: 'Express' });
});
//Where the vehicles are registered POST METHOD
app.post('/veiculos', (req, res) => {
  const placa = req.body.placa;
  const modelo = req.body.modelo;
  const cor = req.body.cor;
  const ano = req.body.ano;
  const marca = req.body.marca;
  const dispo = req.body.dispo;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database', err);
      res.status(500).send('Internal server error');
      return;
    }
    

    const sql = "INSERT INTO veiculos (marca, modelo, ano, placa, cor, disponibilidade) VALUES (?, ?, ?, ?, ?, ?)";
    connection.query(sql, [marca, modelo, ano, placa, cor, dispo], (error, results) => {
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
        console.log('New vehicle inserted');
      }
    });
  });
  res.render('home', { title: 'Express' });
});
//Where the reservers are registered POST METHOD
app.post('/reservas', (req, res) => {
  const id_cliente = req.body.id_cliente;
  const id_veiculo = req.body.id_veiculo;
  const data_inicio = req.body.data_retirada;
  const data_fim = req.body.data_devolucao;
  
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database', err);
      res.status(500).send('Internal server error');
      return;
    }
    

    const sql = "INSERT INTO reservas (id_cliente, id_veiculo, data_retirada, data_devolucao) VALUES (?, ?, ?, ?)";
    connection.query(sql, [id_cliente, id_veiculo, data_inicio, data_fim], (error, results) => {
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
        console.log('New reserve inserted');
      }
    });
  });
  res.render('home', { title: 'Express' });


});

// Display all clients
app.get('/clientes', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database', err);
      res.status(500).send('Internal server error');
      return;
    }
    const sql = "SELECT * FROM clientes";
    connection.query(sql, (error, results) => {
      connection.release(); // release the connection
      if (error) {
        console.error(error);
        res.status(500).send('Internal server error');
        return;
      }
      res.render('clientes', { title: 'Clientes', clientes: results });
    });
  });
});
// Display all vehicles
app.get('/veiculos', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database', err);
      res.status(500).send('Internal server error');
      return;
    }
    const sql = "SELECT * FROM veiculos";
    connection.query(sql, (error, results) => {
      connection.release(); // release the connection
      if (error) {
        console.error(error);
        res.status(500).send('Internal server error');
        return;
      }
      res.render('veiculos', { title: 'Veiculos', veiculos: results });
    });
  });
});
// Display all reserves
app.get('/reservas', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database', err);
      res.status(500).send('Internal server error');
      return;
    }
    const sql = "SELECT * FROM reservas";
    connection.query(sql, (error, results) => {
      connection.release(); // release the connection
      if (error) {
        console.error(error);
        res.status(500).send('Internal server error');
        return;
      }
      res.render('reservas', { title: 'Reservas', reservas: results });
    });
  });
});
// GET edit page
app.get('/edit', (req, res) => { 
  res.render('editar', { title: 'Editar' });
});
// time for editing the tables

// edit clients
app.post('/clientes/alterado/:id', (req, res) => {
  const id = req.body.id;
  const email = req.body.email;
  const endereco = req.body.endereco;
  const telefone = req.body.telefone;
  const name = req.body.name;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database', err);
      res.status(500).send('Internal server error');
      return;
    }

    const sql = "UPDATE clientes SET nome=?, endereco=?, telefone=?, email=? WHERE id=?";
    connection.query(sql, [name, endereco, telefone, email, id], (error, results) => {
      connection.release(); // release the connection
      if (error) {
        console.error(error);
        res.status(500).send('Internal server error');
        return;
      } else if (results.affectedRows === 0) {
        console.error('No rows were updated');
        res.status(404).send('Not found');
        return;
      }

      console.log('Client updated');
      res.redirect('/clientes');
    });
  });
});
// edit vehicles
app.post('/veiculos/alterado/:id', (req, res) => {
  const id = req.body.id;
  const modelo = req.body.modelo;
  const marca = req.body.marca;
  const ano = req.body.ano;
  const placa = req.body.placa;
  const cor = req.body.cor;
  const dispo = req.body.disponibilidade;
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database', err);
      res.status(500).send('Internal server error');
      return;
    }

    const sql = "UPDATE veiculos SET marca=?, modelo=?, ano=?, placa=?, cor=?, disponibilidade=?, WHERE id=?";
    connection.query(sql, [marca, modelo, ano, placa, cor, dispo, id], (error, results) => {
      connection.release(); // release the connection
      if (error) {
        console.error(error);
        res.status(500).send('Internal server error');
        return;
      } else if (results.affectedRows === 0) {
        console.error('No rows were updated');
        res.status(404).send('Not found');
        return;
      }

      console.log('Vehicle updated');
      res.redirect('/veiculos');
    });
  });
});
// edit reserves
app.post('/reservas/alterado/:id', (req, res) => {
  const id = req.body.id;
  const id_cliente = req.body.id_cliente;
  const id_veiculo = req.body.id_veiculo;
  const data_inicio = req.body.data_inicio;
  const data_fim = req.body.data_fim;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database', err);
      res.status(500).send('Internal server error');
      return;
    }

    const sql = "UPDATE reservas SET id_cliente=?, id_veiculo=?, data_retirada=?, data_devolucao=? WHERE id=?";
    connection.query(sql, [id_cliente, id_veiculo, data_inicio, data_fim, id], (error, results) => {
      connection.release(); // release the connection
      if (error) {
        console.error(error);
        res.status(500).send('Internal server error');
        return;
      } else if (results.affectedRows === 0) {
        console.error('No rows were updated');
        res.status(404).send('Not found');
        return;
      }

      console.log('Reservation updated');
      res.redirect('/reservas');
    });
  });
});

// time for deleting the tables
app.get('/delete', (req, res) => {
  res.render('delete', { title: 'Delete' });
});
// delete clients
app.post('/clientes/deletado', (req, res) => {
  const id = req.params.id;
  pool.getConnection((err, connection) => {
    if (err) {
      
      console.error('Error connecting to database', err);
      res.status(500).send('Internal server error');
      return;
    }

    const sql = "DELETE FROM clientes WHERE id=?";
    connection.query(sql, [id], (error, results) => {
      connection.release(); // release the connection
      if (error) {
        console.error(error);
        res.status(500).send('Internal server error');
        return;
      } 
      else if (results.affectedRows === 0) {
        console.error('No rows were deleted');
        res.status(404).send('Not found');
        return;
      }

      console.log('Client deleted');
      res.redirect('/clientes');
    });
  });
});
// delete vehicles
app.post('/veiculos/deletado/:id', (req, res) => {
  const id = req.params.id;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database', err);
      res.status(500).send('Internal server error');
      return;
    }

    const sql = "DELETE FROM veiculos WHERE id=?";
    connection.query(sql, [id], (error, results) => {
      connection.release(); // release the connection
      if (error) {
        console.error(error);
        res.status(500).send('Internal server error');
        return;
      } else if (results.affectedRows === 0) {
        console.error('No rows were deleted');
        res.status(404).send('Not found');
        return;
      }

      console.log('Vehicle deleted');
      res.redirect('/veiculos');
    });
  });
});
// delete reserves
app.post('/reservas/deletado/:id', (req, res) => {
  const id = req.params.id;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database', err);
      res.status(500).send('Internal server error');
      return;
    }

    const sql = "DELETE FROM reservas WHERE id=?";
    connection.query(sql, [id], (error, results) => {
      connection.release(); // release the connection
      if (error) {
        console.error(error);
        res.status(500).send('Internal server error');
        return;
      } else if (results.affectedRows === 0) {
        console.error('No rows were deleted');
        res.status(404).send('Not found');
        return;
      }

      console.log('Reservation deleted');
      res.redirect('/reservas');
    });
  });
});




app.listen(port, () => {
  console.log(`Website rodando no link http://localhost:${port}`);
});

