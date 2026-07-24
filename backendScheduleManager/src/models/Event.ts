import mongoose, { Schema, Document, Types, PopulatedDoc } from "mongoose"
import { IUser } from "./User"
import { ISpace } from "./Space"

export const eventStatus = {
    SOLICITADO: "solicitado",
    APROBADO: "aprobado",
    RECHAZADO: "rechazado",
    REALIZADO: "realizado",
    CANCELADO: "cancelado",
} as const

export type EventStatus = typeof eventStatus[keyof typeof eventStatus]

export interface IEvent extends Document {
    titulo: string
    espacioId: PopulatedDoc<ISpace & Document>
    createdBy: PopulatedDoc<IUser & Document>
    responsable: string
    fecha: string
    horaInicio: string
    horaFin: string
    asistentes: number
    estado: EventStatus
}

const EventSchema: Schema = new Schema(
    {
        titulo: {
            type: String,
            required: true,
            trim: true,
        },
        espacioId: {
            type: Types.ObjectId,
            ref: "Space",
            required: true,
        },
        createdBy: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
        responsable: {
            type: String,
            required: true,
            trim: true,
        },
        fecha: {
            type: String,
            required: true,
        },
        horaInicio: {
            type: String,
            required: true,
        },
        horaFin: {
            type: String,
            required: true,
        },
        asistentes: {
            type: Number,
            required: true,
            min: 1,
        },
        estado: {
            type: String,
            enum: Object.values(eventStatus),
            default: eventStatus.SOLICITADO,
        },
    },
    { timestamps: true }
)

const Event = mongoose.model<IEvent>("Event", EventSchema)
export default Event
