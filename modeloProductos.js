const mongoose = require('mongoose')

const productoSchema = mongoose.Schema(
    {

        nombre: {
            type: String
        },

        precio: {
            type: String
        },
        estrellas: {
            type: String
        },
        descripcion: {
            type: String
        },
        imagen: {
            type: String
        },

        tipo_de_producto: {
            type: String
        },

    },
    {
        timestamps: true
    }

)

const Producto= mongoose.model("Producto",productoSchema)

module.exports= Producto