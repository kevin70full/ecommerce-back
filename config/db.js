const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Base de Datos Conectada')
    } catch (error) {
        console.log('Error')
        process.exit(1)
    }
}

module.exports=connectDB