const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
const usuarios = require('./rutas/usuariosRutas');
//const cors = requiere('cors');

mongoose.connect('mongodb+srv://Internship:hw1021@clusterhw.4mpkomf.mongodb.net/HwProject?retryWrites=true&w=majority',
{useNewUrlParser: true , useUnifiedTopology:true})
    .then(() => {
        console.log("Conectado a MongoDB");
    })
    .catch((err) => {
        console.log("Error de conexion a MongoDB" + err);
    });

mongoose.set('useFindAndModify', false);

/*Sesiones*/
const app = express();
app.use(session({
    secret:"abc lo que sea",
    resave: true,
    saveUninitialized: true
}));


app.set('view engine', 'ejs');
//app.use(cors());
app.use('/', express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true })); //Para recibir datos del formulario
app.use('/', usuarios);

const port = 3000;

app.listen(port, () => {
    console.log("Servidor en el puerto " + port);
});