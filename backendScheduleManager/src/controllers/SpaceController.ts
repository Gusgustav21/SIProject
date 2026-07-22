import type { Request, Response } from "express";
import Space from "../models/Space";
import Event from "../models/Event";

export class SpaceController {
    static createSpace = async (req: Request, res: Response) => {
        try {
            const space = new Space(req.body)
            await space.save()
            res.status(201).json({ message: "Espacio creado correctamente", space })
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Error al crear el espacio" })
        }
    }

    static getAllSpaces = async (req: Request, res: Response) => {
        try {
            const spaces = await Space.find()
            res.json(spaces)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Error al obtener los espacios" })
        }
    }

    static getSpaceById = async (req: Request, res: Response) => {
        try {
            // Space is already bound by spaceExists middleware
            res.json(req.space)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Error al obtener el espacio" })
        }
    }

    static updateSpace = async (req: Request, res: Response) => {
        try {
            const { nombre, capacidad, tipo, ubicacion } = req.body
            
            req.space.nombre = nombre || req.space.nombre
            req.space.capacidad = capacidad || req.space.capacidad
            req.space.tipo = tipo || req.space.tipo
            req.space.ubicacion = ubicacion || req.space.ubicacion

            await req.space.save()
            res.json({ message: "Espacio actualizado correctamente", space: req.space })
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Error al actualizar el espacio" })
        }
    }

    static deleteSpace = async (req: Request, res: Response) => {
        try {
            // Check if there are events associated with this space
            const hasAssociatedEvents = await Event.exists({ espacioId: req.space._id })
            if (hasAssociatedEvents) {
                return res.status(400).json({ 
                    error: "No se puede eliminar el espacio. Actualmente existen eventos asociados a este espacio." 
                })
            }

            await req.space.deleteOne()
            res.json({ message: "Espacio eliminado correctamente" })
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Error al eliminar el espacio" })
        }
    }
}
