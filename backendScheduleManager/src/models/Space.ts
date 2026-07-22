import mongoose, { Schema, Document } from "mongoose"

export const spaceTypes = {
    LABORATORIO: "laboratorio",
    SALON: "salon",
    AUDITORIO: "auditorio"
} as const

export type SpaceType = typeof spaceTypes[keyof typeof spaceTypes]

export interface ISpace extends Document {
    nombre: string
    capacidad: number
    tipo: SpaceType
    ubicacion: string
}

const SpaceSchema: Schema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    capacidad: {
        type: Number,
        required: true,
        min: 1
    },
    tipo: {
        type: String,
        required: true,
        enum: Object.values(spaceTypes)
    },
    ubicacion: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true })

const Space = mongoose.model<ISpace>("Space", SpaceSchema)
export default Space
