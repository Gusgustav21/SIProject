import { Request, Response } from "express"
import bcrypt from "bcrypt"
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import Token from "../models/Token"
import { generateToken } from "../utils/token"
import { AuthEmail } from "../emails/AuthEmail"
import { generateJWT } from "../utils/jwt"

export default class AuthController {

    static createAccount = async (req: Request, res: Response) => {
        try {
            const { password, email } = req.body
            const userExists = await User.findOne({email})
            if(userExists) {
                const error = new Error("El correo ya está registrado")
                return res.status(409).json({error: error.message})
            }

            const user = new User(req.body)
            user.password = await hashPassword(password)

            const token = new Token()
            token.token = generateToken()
            token.user = user._id

            await Promise.allSettled([user.save(), token.save(), AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })
            ])
            res.send("Cuenta creada exitosamente, confirme su cuenta con el token que le enviamos al correo")
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Error creando al usuario" })
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body

            const tokenExists = await Token.findOne({token})

            if(!tokenExists) {
                const error = new Error("El token no existe o ya venció")
                return res.status(404).json({error: error.message})
            }

            const confirmedUser = await User.findById(tokenExists.user)

            confirmedUser.confirmed = true

            await Promise.allSettled([confirmedUser.save(), tokenExists.deleteOne()])
            
            res.send("Cuenta confirmada exitosamente")
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Error confirmando al usuario" })
        }
    }

    static loginAccount = async (req: Request, res: Response) => {
        try {
            const { password, email } = req.body
            const user = await User.findOne({email})
            if(!user) {
                const error = new Error("El usuario no está registrado")
                return res.status(404).json({error: error.message})
            }

            if(!user.confirmed) {
                const token = new Token()
                token.token = generateToken()
                token.user = user._id

                await token.save()

                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })

                const error = new Error("El usuario no está confirmado, hemos enviado un e-mail de confirmación")
                return res.status(401).json({error: error.message})
            }

            const isPasswordCorrect = await checkPassword(password, user.password)

            if(!isPasswordCorrect) {
                const error = new Error("Contraseña incorrecta")
                return res.status(401).json({error: error.message})
            }

            const token = generateJWT({id: user._id})

            res.send(token)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Error creando al usuario" })
        }
    }

    static requestConfirmAccount = async (req: Request, res: Response) => {
        try {
            const { email } = req.body
            const user = await User.findOne({email})
            if(!user) {
                const error = new Error("El correo no está registrado")
                return res.status(409).json({error: error.message})
            }

            if(user.confirmed) {
                const error = new Error("El usuario ya está confirmado")
                return res.status(403).json({error: error.message})
            }

            const token = new Token()
            token.token = generateToken()
            token.user = user._id

            await Promise.allSettled([user.save(), token.save(), AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })
            ])
            res.send("Token reenviado correctamente")
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Error creando al usuario" })
        }
    }

    static forgotPassword = async (req: Request, res: Response) => {
        try {
            const { email } = req.body
            const user = await User.findOne({email})
            if(!user) {
                const error = new Error("El correo no está registrado")
                return res.status(409).json({error: error.message})
            }

            const token = new Token()
            token.token = generateToken()
            token.user = user._id

            await Promise.allSettled([token.save(), AuthEmail.sendPasswordResetToken({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })
            ])
            res.send("Revisa tu email para instrucciones")
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Error creando al usuario" })
        }
    }

    static validateNewPasswordToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.body

            const tokenExists = await Token.findOne({token})

            if(!tokenExists) {
                const error = new Error("El token no existe o ya venció")
                return res.status(404).json({error: error.message})
            }
            
            res.send("Token válido")
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Error confirmando al usuario" })
        }
    }

    static updatePasswordWithToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.params

            const tokenExists = await Token.findOne({token})

            if(!tokenExists) {
                const error = new Error("El token no existe o ya venció")
                return res.status(404).json({error: error.message})
            }

            const user = await User.findById(tokenExists.user)
            if(!user) {
                const error = new Error("El usuario no está registrado")
                return res.status(404).json({error: error.message})
            }

            if(!user.confirmed) {
                const token = new Token()
                token.token = generateToken()
                token.user = user._id

                await token.save()

                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })

                const error = new Error("El usuario no está confirmado, hemos enviado un e-mail de confirmación")
                return res.status(401).json({error: error.message})
            }

            user.password = await hashPassword(req.body.password)

            await Promise.allSettled([user.save(), tokenExists.deleteOne()])

            res.send("Contraseña actualizada exitosamente")
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Error creando al usuario" })
        }
    }

    static user = async (req: Request, res: Response) => {
        return res.json(req.user)
    }  

    static updateUserRole = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params
            const { role } = req.body

            if (!["regular", "admin"].includes(role)) {
                return res.status(400).json({ error: "Rol no válido" })
            }

            const userToUpdate = await User.findById(userId)
            if (!userToUpdate) {
                return res.status(404).json({ error: "Usuario no encontrado" })
            }

            userToUpdate.role = role
            await userToUpdate.save()

            res.json({ 
                message: "Rol de usuario actualizado correctamente", 
                user: { 
                    id: userToUpdate._id, 
                    name: userToUpdate.name, 
                    email: userToUpdate.email, 
                    role: userToUpdate.role 
                } 
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Error al actualizar el rol del usuario" })
        }
    }

}