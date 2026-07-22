import type { Request, Response, NextFunction } from "express"
import Event, { IEvent } from "../models/Event"

declare global {
    namespace Express {
        interface Request {
            event: IEvent
        }
    }
}

export default async function eventExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { eventId } = req.params
        const event = await Event.findById(eventId)

        if (!event) {
            return res.status(404).json({ error: "Evento no encontrado" })
        }

        req.event = event
        next()
    } catch (error) {
        res.status(500).json({ error: "Hubo un error al buscar el evento" })
    }
}
