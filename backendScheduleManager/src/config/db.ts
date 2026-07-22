import mongoose from "mongoose"
import colors from "colors"
import { exit } from "node:process"

export const connectDB = async () => {
    try {
        const mongoUri = process.env.DATABASE_URL
        if (!mongoUri) {
            throw new Error("DATABASE_URL no está definida. Revisa tu archivo .env y dotenv.config().")
        }

        const connection = await mongoose.connect(mongoUri)
        const url = `${connection.connection.host}:${connection.connection.port}`
        console.log(colors.cyan.bold(`Conectado a la base de Datos: ${url}`))
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        console.log(colors.bgRed(message))
        exit(1)
    }
}