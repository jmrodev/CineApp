const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

const movies = [
    {
        title: 'The Matrix',
        genre: 'Sci-Fi',
        schedule: '8:00 PM',
        room: 'Sala 1',
        available_seats: 25
    },
    {
        title: 'The Lord of the Rings',
        genre: 'Fantasy',
        schedule: '9:00 PM',
        room: 'Sala 2',
        available_seats: 20
    },
    {
        title: 'The Godfather',
        genre: 'Crime',
        schedule: '10:00 PM',
        room: 'Sala 3',
        available_seats: 15
    }
];

app.get('/movies', (req, res) => {
    res.json(movies);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});