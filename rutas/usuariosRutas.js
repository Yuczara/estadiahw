const express = require('express');
const bcrypt = require('bcrypt');
const ruta = express.Router();
const Usuario = require('../modelos/userModel');
const Candidato = require('../modelos/candidatesModel.js');
const swal = require('sweetalert');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const mongoose = require('mongoose');

//ununununuuununuunuuuunununun LOGIN unununununununununununununununununuunnununun
ruta.post('/login', (req, res) => {
    let body = req.body;
    Usuario.findOne({email: body.email},(err, usuarioDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err: err                
            })
        }

        if(usuarioDB){
        var result = (body.password == usuarioDB.password);
        if (result) {
            req.session.user = usuarioDB.email;
             var rol = (usuarioDB.rol);
             if(rol== "common"){
                res.redirect('/mostrarDatos');
             }else if(rol=="admin"){
                res.redirect('/mostrarUsuarios');
             }

        } else {
            res.send('<script>alert("Contraseña Incorrecta"); location.href = "loginPage.html";</script>')
        }
        
    }else{
         res.send('<script>alert("No existe el usuario"); location.href = "loginPage.html";</script>')
       
    }
    })
});

ruta.get('/sesion', (req, res) => {
    req.session.user = 'Fulanito';
    res.send("Sesion inciada");
});

ruta.get('/cerrar', (req, res) => {
    req.session.destroy();
    res.redirect('/loginPage.html')
});

ruta.get('/register', (req, res) => {
    res.redirect('register')
});
ruta.get('/profile', (req, res) => {
    res.redirect('profile')
});




//unununununununununun SIGN IN ununununununununununununununununun
ruta.post('/userRegister', (req, res) => {
    let body = req.body;
    var usuario = new Usuario({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        status:"true",
        rol:"common",
    });
    // BUSCA SI EL CORREO EXISTE EN LA BD
    Usuario.findOne({email: body.email},(err, usuarioDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err: err                
            })
        }
        // SI EL CORREO EXISTE AVISE AL USUARIO 
        if(usuarioDB){
            res.send('<script>alert("Ya existe una cuenta con éste correo, intente con otro"); location.href = "loginPage.html";</script>')
        } else {
            // SI NO EXISTE, CREA UN USUARIO EN LA BD Y NOTIFICA AL USUARIO
            var resultado = usuario.save();
            resultado.then(prod => {
                res.send('<script>alert("Usuario Registrado exitosamente"); location.href = "loginPage.html";</script>')
            }).catch(err => {
                res.status(400).send("error"+err);
            }); 
        }
    });        
    
});


//---------------- REGISTRAR CANDIDATO ------------------------

ruta.post('/insertarCandidato', (req, res) => {
    var candidato = new Candidato({
        name: req.body.name,
        lastname: req.body.lastname,
        age:req.body.age,
        about:req.body.about,
        speciality: req.body.speciality,
        english: req.body.english,
        achievements: req.body.achievements,
        email: req.session.user,      
        telephone: req.body.telephone,   
        address: req.body.address,
        status: "true",
    });
    var resultado = candidato.save();
    resultado
        resultado.then(prod => {
            res.send('<script>alert("Registrado exitosamente"); location.href = "/mostrarDatos";</script>')
        }).catch(err => {
            res.status(400).send("error"+err);
        }); 
});

//--------------------------------------------ADMINISTRADOR----------------------------------
// ----------------- MOSTRAR USUARIOS -------------------------
ruta.get('/mostrarUsuarios', (req, res) => {
    if(!req.session.user){
        res.redirect('index.html')
    }
    var usuarios = Candidato.find({ "status": true });
    usuarios.then(user => {
            res.render('mostrarUsuario', { usuarios: user });
        })
        .catch(err => {
            res.status(400).send("Error al extraer la informacion");
        });
});
//-----------------------------------COMMON USERS-----------------
//-----------------MUESTRA DATOS DE USUARIOS REGISTRADOS O REDIRIGE A UN FORM VACIO------------------------
ruta.get('/mostrarDatos', (req, res) => {
    if(!req.session.user){
        res.redirect('index.html')
    }

    var correo = req.session.user;
    console.log(req.session.user);
    
    var candidatos = Candidato.find({ "email": req.session.user });
    candidatos.then(candidato => {
        if (candidato.length > 0) {
            res.render('registered', { candidatos: candidato });
        } else {
            res.render('register', { candidates : candidato });
       }
            
        })
        .catch(err => {
            res.status(400).send("Error al extraer la informacion");
        });
});

//-------------------ACTUALIZAR------------------------------
ruta.post('/modificarDatos',(req,res)=>{
    var {id,name,lastname,age,about,speciality,english,achievements,email,telephone,address,status}=req.body;
    var resultado=Candidato.findByIdAndUpdate(id,
        {
            $set:{
                name,
                lastname,
                age,
                about,
                speciality,
                english,
                achievements,
                email,
                telephone,
                address,
                status
            }
        },
        {new:true}
        );
    resultado
    .then(prod=>{
        res.redirect('/mostrarDatos');
    })
    .catch(err=>{
        res.status(400).send("Error al realizar actualizacion "+err);
    });
});


ruta.get('/mostrarPerfil', (req, res) => {
    if(!req.session.user){
        res.redirect('loginPage.html')
    }

    var correo = req.session.user;
    var resultado = Candidato.find({"email":correo});
    resultado
    .then(candidato =>{
        if (candidato.length > 0) {
            res.render('profile', { candidatos : candidato });
           
        } else {
            res.send('<script>alert("Aún no estás postulado"); location.href = "/mostrarDatos";</script>'); 
                                                
        }
    })
});


//CONSTRUIR UN EXCEL
ruta.get('/exportar', (req, res) => {

    const createCsvWriter = require('csv-writer').createObjectCsvWriter;
    const fs = require('fs');

    // Conexión a la base de datos MongoDB
    mongoose.connect('mongodb+srv://Internship:hw1021@clusterhw.4mpkomf.mongodb.net/HwProject?retryWrites=true&w=majority', { useNewUrlParser: true })
    .then(() => {
        console.log('Conectado a MongoDB y listo para descargar');
    })
    .catch((err) => {
        console.log(`Error de conexión a MongoDB: ${err}`);
    });


    // Consulta a la base de datos para obtener todos los documentos de la colección
    Candidato.find({ "status": true }, (err, data) => {
    if (err) {
        console.log(`Error en la consulta a la base de datos: ${err}`);
    } else {
        // Creación del archivo CSV
        console.log(data);
        const csvWriter = createCsvWriter({
        path: 'Candidatos_InternshipHW.csv',
        header: [
            { id: 'name', title: 'Name' },
            { id: 'lastname', title: 'Lastname' },
            { id: 'age', title: 'Age' },
            { id: 'about', title: 'About' },
            { id: 'speciality', title: 'Speciality' },
            { id: 'english', title: 'English level' },
            { id: 'achievements', title: 'Achievements' },
            { id: 'email', title: 'Email' },
            { id: 'telephone', title: 'Telephone' },
            { id: 'address', title: 'Address' },
        ]
        });

        // Escritura de los datos en el archivo CSV
        csvWriter.writeRecords(data)
        .then(() => {
            console.log('Archivo CSV creado exitosamente');

            // Descarga del archivo CSV
            fs.readFile('Candidatos_InternshipHW.csv', (err, data) => {
            if (err) {
                console.log(`Error al leer el archivo CSV: ${err}`);
            } else {
                res.setHeader('Content-Disposition', 'attachment; filename=mydata.csv');
                res.set('Content-Type', 'text/csv');
                res.send(data);
            }
            });
        })
        .catch((err) => {
            console.log(`Error al escribir en el archivo CSV: ${err}`);
        });
    }
    });

});

module.exports = ruta;