const express = require('express');

const cTable = require('console.table');
const inquirer = require('inquirer');

const queryRoutes = require('./routes');

const db = require('./db/connection');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api/', queryRoutes);


app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Now listening on ${PORT}, my friend`);
});
