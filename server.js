const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const graphqlHTTP = require('express-graphql');
require('dotenv').config();

const schema = require('./schema');

const app = express();
app.use(cors());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
const connection = mongoose.connection;
connection.once('open', ()=> {
  console.log("Mongodb database connection established successfully");
})

app.use(
    '/graphql',
    graphqlHTTP({
      schema,
      graphiql: true
    })
  );
  
const PORT = process.env.PORT || 5001;
  
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));