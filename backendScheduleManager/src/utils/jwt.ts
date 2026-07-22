import jwt from "jsonwebtoken"
import { Types } from "mongoose"

interface JWTPayload {
    id: Types.ObjectId
}

export const generateJWT = (payload: JWTPayload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "180d"
    })

    return token
}