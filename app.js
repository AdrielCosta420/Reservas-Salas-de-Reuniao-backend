const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')

const UserRoutes = require('./routes/UserRoutes');
const MeetingRoomRoutes = require('./routes/MeetingRoomRoutes');

const app = express();

app.use(cors());

app.use(express.json());


app.use('/users', UserRoutes);
app.use('/rooms', MeetingRoomRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ msg: "Bem vindo a nossa API!" });
})

//Credentials
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.didtcdo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => {
        console.log('Conectou ao banco!');
        app.listen(3000);
    }).catch((err) => console.log(err));
