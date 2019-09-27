 express = require('express');
const postsRouter = require('./Posts/postsRouter');

const server = express();
server.use(express.json()) // middleware


//ROUTES
server.use('/api/posts', postsRouter);

server.listen(4444, () => console.log('Server on port 4444'));

