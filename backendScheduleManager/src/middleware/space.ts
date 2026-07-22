import type { Request, Response, NextFunction } from "express"
import Space, { ISpace } from "../models/Space"

declare global {
    namespace Express {
        interface Request {
            space: ISpace
        }
    }
}

export default async function spaceExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { spaceId } = req.params
        const space = await Space.findById(spaceId)

        if (!space) {
            return res.status(404).json({ error: "Espacio no encontrado" })
        }

        req.space = space
        next()
    } catch (error) {
        res.status(500).json({ error: "Hubo un error al buscar el espacio" })
    }
}
