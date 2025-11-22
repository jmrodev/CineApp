const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

const movieRouter = require('./routers/movieRouter');
app.use('/api', movieRouter);



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});