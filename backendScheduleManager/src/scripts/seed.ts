/**
 * Seed MongoDB with FaCyT spaces, events, and an admin user.
 *
 * Usage (from backendScheduleManager, with DATABASE_URL in .env):
 *   npm run seed
 *
 * Optional env:
 *   SEED_ADMIN_EMAIL=admin@uc.edu.ve
 *   SEED_ADMIN_PASSWORD=admin12345
 *   SEED_ADMIN_NAME=Coordinación FaCyT
 */
import dotenv from "dotenv"
dotenv.config()

import colors from "colors"
import { connectDB } from "../config/db"
import User from "../models/User"
import Space from "../models/Space"
import Event from "../models/Event"
import Token from "../models/Token"
import { hashPassword } from "../utils/auth"
import { ESPACIOS_INICIALES } from "../data/seedSpaces"
import { EVENTOS_INICIALES } from "../data/seedEvents"

async function seed() {
    await connectDB()

    const adminEmail = (process.env.SEED_ADMIN_EMAIL ?? "admin@uc.edu.ve").toLowerCase()
    const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "admin12345"
    const adminName = process.env.SEED_ADMIN_NAME ?? "Coordinación FaCyT"

    console.log(colors.yellow("Limpiando colecciones Event, Space y Token…"))
    await Promise.all([Event.deleteMany({}), Space.deleteMany({}), Token.deleteMany({})])

    let admin = await User.findOne({ email: adminEmail })
    if (!admin) {
        admin = new User({
            email: adminEmail,
            name: adminName,
            password: await hashPassword(adminPassword),
            confirmed: true,
            role: "admin",
        })
        await admin.save()
        console.log(colors.green(`Admin creado: ${adminEmail}`))
    } else {
        admin.name = adminName
        admin.confirmed = true
        admin.role = "admin"
        admin.password = await hashPassword(adminPassword)
        await admin.save()
        console.log(colors.green(`Admin actualizado: ${adminEmail}`))
    }

    const spaceIdMap = new Map<string, string>()

    for (const espacio of ESPACIOS_INICIALES) {
        const created = await Space.create({
            nombre: espacio.nombre,
            capacidad: espacio.capacidad,
            tipo: espacio.tipo,
            ubicacion: espacio.ubicacion,
        })
        spaceIdMap.set(espacio.id, created._id.toString())
    }
    console.log(colors.green(`${ESPACIOS_INICIALES.length} espacios insertados`))

    const eventsToInsert = EVENTOS_INICIALES.map((evento) => {
        const espacioId = spaceIdMap.get(evento.espacioId)
        if (!espacioId) {
            throw new Error(`Espacio no mapeado: ${evento.espacioId} (evento ${evento.id})`)
        }
        return {
            titulo: evento.titulo,
            espacioId,
            createdBy: admin!._id,
            responsable: evento.responsable,
            fecha: evento.fecha,
            horaInicio: evento.horaInicio,
            horaFin: evento.horaFin,
            asistentes: evento.asistentes,
            estado: evento.estado,
        }
    })

    await Event.insertMany(eventsToInsert)
    console.log(colors.green(`${eventsToInsert.length} eventos insertados`))

    console.log(colors.cyan.bold("Seed completado."))
    console.log(colors.white(`  Login: ${adminEmail} / ${adminPassword}`))
    process.exit(0)
}

seed().catch((error) => {
    console.error(colors.bgRed(error instanceof Error ? error.message : String(error)))
    process.exit(1)
})
