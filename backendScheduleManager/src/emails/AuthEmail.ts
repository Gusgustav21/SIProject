import { transporter } from "../config/nodemailer"
import type { IUser } from "../models/User"

interface IEmail {
    email: IUser["email"],
    name: IUser["name"],
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async ({email, name, token}: IEmail) => {
        await transporter.sendMail({
            from: "FaCyT Event Manager <admin@uc.edu.ve>",
            to: email,
            subject: "FaCyT Event Manager - Confirma tu cuenta",
            text: "FaCyT Event Manager - Confirma tu cuenta",
            html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; padding: 40px 20px; color: #1e293b; line-height: 1.6;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #e2e8f0;">
        <div style="background-color: #0f172a; padding: 24px; text-align: center; border-bottom: 3px solid #06b6d4;">
            <span style="font-size: 24px; font-weight: bold; color: #ffffff; letter-spacing: 0.5px;">🎓 FaCyT Event Manager</span>
            <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Universidad de Carabobo</div>
        </div>
        <div style="padding: 40px 32px;">
            <h2 style="margin-top: 0; color: #0f172a; font-size: 20px; font-weight: 700; border-bottom: 1px solid #f1f5f9; padding-bottom: 16px;">¡Hola, ${name}!</h2>
            <p style="font-size: 16px; color: #334155; margin-bottom: 24px;">Te damos la bienvenida a <b>FaCyT Event Manager</b>. Ya casi está lista tu cuenta en la plataforma de gestión de eventos.</p>
            <p style="font-size: 15px; color: #475569; margin-bottom: 32px;">Para confirmar tu cuenta, por favor haz clic en el siguiente enlace de verificación:</p>
            <div style="text-align: center; margin-bottom: 32px;">
                <a href="${process.env.FRONTEND_URL + "/auth/confirm_account"}" style="background-color: #06b6d4; color: #ffffff; padding: 12px 32px; font-weight: 600; text-decoration: none; border-radius: 8px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(6, 182, 212, 0.2); font-size: 15px;">Confirmar Cuenta</a>
            </div>
            <p style="font-size: 15px; color: #475569; margin-bottom: 12px;">E ingresa el siguiente código de confirmación de un solo uso (token):</p>
            <div style="background-color: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; text-align: center; font-size: 24px; font-weight: 700; letter-spacing: 4px; color: #0f172a; font-family: 'Courier New', Courier, monospace; margin-bottom: 24px;">
                ${token}
            </div>
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 4px; font-size: 13px; color: #78350f; margin-bottom: 32px;">
                ⚠️ <strong>Importante:</strong> Este código expira en 10 minutos por razones de seguridad.
            </div>
            <p style="font-size: 13px; color: #64748b; margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 16px;">Si no has solicitado el registro en nuestra plataforma, puedes ignorar este correo de forma segura.</p>
        </div>
        <div style="background-color: #f8fafc; padding: 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0 0 8px 0;"><strong>FaCyT Event Manager</strong> - Coordinación de FaCyT</p>
            <p style="margin: 0;">Universidad de Carabobo &bull; Valencia, Venezuela</p>
        </div>
    </div>
</div>`
        })
    }

    static sendPasswordResetToken = async ({email, name, token}: IEmail) => {
        await transporter.sendMail({
            from: "FaCyT Event Manager <admin@uc.edu.ve>",
            to: email,
            subject: "FaCyT Event Manager - Restablece tu contraseña",
            text: "FaCyT Event Manager - Restablece tu contraseña",
            html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; padding: 40px 20px; color: #1e293b; line-height: 1.6;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #e2e8f0;">
        <div style="background-color: #0f172a; padding: 24px; text-align: center; border-bottom: 3px solid #06b6d4;">
            <span style="font-size: 24px; font-weight: bold; color: #ffffff; letter-spacing: 0.5px;">🎓 FaCyT Event Manager</span>
            <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Universidad de Carabobo</div>
        </div>
        <div style="padding: 40px 32px;">
            <h2 style="margin-top: 0; color: #0f172a; font-size: 20px; font-weight: 700; border-bottom: 1px solid #f1f5f9; padding-bottom: 16px;">¡Hola, ${name}!</h2>
            <p style="font-size: 16px; color: #334155; margin-bottom: 24px;">Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en <b>FaCyT Event Manager</b>.</p>
            <p style="font-size: 15px; color: #475569; margin-bottom: 32px;">Para iniciar el proceso de recuperación de contraseña, haz clic en el siguiente botón:</p>
            <div style="text-align: center; margin-bottom: 32px;">
                <a href="${process.env.FRONTEND_URL + "/auth/new_password"}" style="background-color: #06b6d4; color: #ffffff; padding: 12px 32px; font-weight: 600; text-decoration: none; border-radius: 8px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(6, 182, 212, 0.2); font-size: 15px;">Restablecer Contraseña</a>
            </div>
            <p style="font-size: 15px; color: #475569; margin-bottom: 12px;">E ingresa el siguiente código de verificación (token) cuando se te solicite:</p>
            <div style="background-color: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; text-align: center; font-size: 24px; font-weight: 700; letter-spacing: 4px; color: #0f172a; font-family: 'Courier New', Courier, monospace; margin-bottom: 24px;">
                ${token}
            </div>
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 4px; font-size: 13px; color: #78350f; margin-bottom: 32px;">
                ⚠️ <strong>Importante:</strong> Este código expira en 10 minutos. Transcurrido este tiempo, deberás realizar una nueva solicitud.
            </div>
            <p style="font-size: 13px; color: #64748b; margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 16px;">Si no has solicitado restablecer tu contraseña, puedes ignorar este correo; tu cuenta seguirá siendo segura y no se realizarán cambios.</p>
        </div>
        <div style="background-color: #f8fafc; padding: 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0 0 8px 0;"><strong>FaCyT Event Manager</strong> - Coordinación de FaCyT</p>
            <p style="margin: 0;">Universidad de Carabobo &bull; Valencia, Venezuela</p>
        </div>
    </div>
</div>`
        })
    }
}