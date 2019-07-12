const express = require('express');

const server = express();
const userRoutes = require('./users/userRouter')
const postRoutes = require('./posts/postRouter')

//
server.use(logger);
server.use('/users', userRoutes);
server.use('/posts', postRoutes);
//


server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware

function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} from ${req.url}`
  );
  next();
};

module.exports = server;
