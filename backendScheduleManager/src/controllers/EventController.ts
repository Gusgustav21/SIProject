import type { Request, Response } from "express";
import Event from "../models/Event";
import Space from "../models/Space";
import { eventStatus } from "../models/Event";

export class EventController {
    static createEvent = async (req: Request, res: Response) => {
        try {
            const { espacioId } = req.body

            // Check if space exists
            const spaceExists = await Space.exists({ _id: espacioId })
            if (!spaceExists) {
                return res.status(404).json({ error: "El espacio físico no existe" })
            }

            const event = new Event(req.body)
            event.createdBy = req.user._id
            event.estado = eventStatus.SOLICITADO // Explicitly set to solicitado

            await event.save()
            res.status(201).json({ message: "Evento solicitado correctamente", event })
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Error al crear el evento" })
        }
    }

    static getAllEvents = async (req: Request, res: Response) => {
        try {
            const events = await Event.find()
                .populate("espacioId")
                .populate("createdBy", "_id name email role")
            res.json(events)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Error al obtener los eventos" })
        }
    }

    static getEventById = async (req: Request, res: Response) => {
        try {
            const event = await Event.findById(req.event._id)
                .populate("espacioId")
                .populate("createdBy", "_id name email role")
            res.json(event)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Error al obtener el evento" })
        }
    }

    static updateEvent = async (req: Request, res: Response) => {
        try {
            // Check if user is owner or admin
            const isOwner = req.event.createdBy.toString() === req.user._id.toString()
            const isAdminUser = req.user.role === "admin"

            if (!isOwner && !isAdminUser) {
                return res.status(403).json({ error: "No tienes permiso para modificar este evento" })
            }

            const { titulo, espacioId, responsable, fecha, horaInicio, horaFin, asistentes } = req.body

            if (espacioId) {
                const spaceExists = await Space.exists({ _id: espacioId })
                if (!spaceExists) {
                    return res.status(404).json({ error: "El espacio físico no existe" })
                }
                req.event.espacioId = espacioId
            }

            req.event.titulo = titulo || req.event.titulo
            req.event.responsable = responsable || req.event.responsable
            req.event.fecha = fecha || req.event.fecha
            req.event.horaInicio = horaInicio || req.event.horaInicio
            req.event.horaFin = horaFin || req.event.horaFin
            req.event.asistentes = asistentes !== undefined ? asistentes : req.event.asistentes

            // "luego de aprobados si se modifican deben ser aprobados de nuevo (o sea pasa a estar en revisión)"
            // If it was already approved, modification resets it to review (solicitado).
            if (req.event.estado === eventStatus.APROBADO) {
                req.event.estado = eventStatus.SOLICITADO
            }

            await req.event.save()
            res.json({ message: "Evento actualizado correctamente", event: req.event })
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Error al actualizar el evento" })
        }
    }

    static patchStatusEvent = async (req: Request, res: Response) => {
        try {
            // This endpoint is only for Admins (protected via router middleware)
            const { estado } = req.body

            if (!Object.values(eventStatus).includes(estado)) {
                return res.status(400).json({ error: "Estado no válido" })
            }

            req.event.estado = estado
            await req.event.save()
            res.json({ message: `Estado del evento actualizado a ${estado} correctamente`, event: req.event })
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Error al actualizar el estado del evento" })
        }
    }

    static deleteEvent = async (req: Request, res: Response) => {
        try {
            // This endpoint is only for Admins (protected via router middleware)
            await req.event.deleteOne()
            res.json({ message: "Evento eliminado correctamente" })
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Error al eliminar el evento" })
        }
    }
}
