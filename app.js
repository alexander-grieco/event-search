
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = express.Router();
const path = require('path');

//initiating express
const app = express();
app.use(cors());
app.use(bodyParser.json())


//routes
const posts = require('./server/routes/posts')

// connecting to distribution
app.use(express.static(path.join(__dirname, 'dist/aghomework8')));
app.use('/posts', posts);


// catch all other routes request and return it to the index
app.get('*', (req, res) =>{
    res.sendFile(path.join(__dirname, 'dist/aghomework8/index.html'))
})


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`))

