const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv= require('dotenv');

dotenv.config();

mongoose.connect('mongodb+srv://admin:test123@node-tut.mdqi6.mongodb.net/node-tut?retryWrites=true&w=majority',
{ useNewUrlParser:true, useUnifiedTopology:true})
.then(()=> console.log('Database Connected'))
.catch(err=> console.log(err));

app.use(express.json());

const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

app.use('/api/user',authRoute);
app.use('/api/posts',postRoute);

app.listen(4000, () => {
    console.log('Server up and running')
})