const express = require('express');
const routes = require('./routes/department-route');
const db = require('./db/connection');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Now listening on ${PORT}, my friend`);
});
