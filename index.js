//IMPORTACIONES 

const express = require('express')
const app = express()
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 3000


// MONGO-DB
const cors = require('cors')
const connectDB = require('./config/db')
const Producto = require('./modeloProductos')
const Usuario = require('./modeloUsuario')
//MIDDLEWARES
require('dotenv').config()
connectDB()
app.use(cors())
app.use(express.json())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get("/Obtener-Productos", async (req, res) => {

    try {
        const productos = await Producto.find({})
        res.json({
            productos
        })
    } catch (error) {
        res.status(500).json({
            msg: 'Hubo un error obteniendo datos'
        })
    }

})

// app.post('/register', (req, res) => {
//     const { username, email, password } = req.body;
//     const usuario = new Usuario({ username, email, password });
//     usuario.save((err) => {
//         if (err) {
//             res.status(500).send('Error al registrar al usuario');
//         } else {
//             res.status(200).send('Usuario registrado');
//         }
//     });
// });
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    const usuario = new Usuario({ username, email, password });
    usuario.save((err) => {
        if (err) {
            res.status(500).json({ message: 'El usuario existe' });
        } else {
            res.status(200).json({ message: 'Usuario registrado con éxito' });
        }
    });
});

// app.post('/login', async (req, res) => {
//     const { email, password } = req.body
//     try {
//         let foundUser = await Usuario.findOne({ email: email })

//         if (!foundUser) {
//             return res.status(400).json({ msg: 'El Usuario no existe' });
//         }
//         const passCorrecto = await bcryptjs.compare(password, foundUser.password)
//         if (!passCorrecto) {
//             return await res.status(400).json({ msg: 'Contraseña Incorrecta' });
//         }

//         const payload = {
//             user: {
//                 id: foundUser.id
//             }
//         }

//         if (email && passCorrecto) {
//             jwt.sign(payload, process.env.SECRET, { expiresIn: 3600000 }, (error, token) => {
//                 if (error) throw error
//                 res.json
//                     ({ token })
//             }
//             )
//         } else {
//             res.json({ msg: 'Hubo un error', error })
//         }

//     } catch (error) {
//         res.json({ msg: 'Hubo un error', error })
//     }
// })

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let foundUser = await Usuario.findOne({ email: email});
        if (!foundUser) {
            return res.status(400).json({ msg: 'El Usuario no existe' });
        }
        const passCorrecto = await bcryptjs.compare(password, foundUser.password)
        if (!passCorrecto) {
            return res.status(400).json({ msg: 'Contraseña Incorrecta' });
        }
        const payload = {
            user: {
                id: foundUser.id
            }
        }

        if (email && passCorrecto) {
            jwt.sign(payload, process.env.SECRET, { expiresIn: 3600000 }, (error, token) => {
                if (error) throw error
                res.json({ token, user: foundUser });
            });
        } else {
            res.status(500).json({ msg: 'Hubo un error al generar el token' });
        }
        

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error al iniciar sesión', error });
    }
});

app.use(verifyToken);

function verifyToken(req, res, next) {
    // Verificar si existe un token enviado en el header de autorización
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        jwt.verify(req.token, process.env.SECRET, (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                req.user = authData.user;
                next();
            }
        });
    } else {
        // Verificar si existe un token en una cookie
        const cookieToken = req.cookies.token;
        if (cookieToken) {
            jwt.verify(cookieToken, process.env.SECRET, (err, authData) => {
                if (err) {
                    res.sendStatus(403);
                } else {
                    req.user = authData.user;
                    next();
                }
            });
        } else {
            res.sendStatus(403);
        }
    }
}







app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })