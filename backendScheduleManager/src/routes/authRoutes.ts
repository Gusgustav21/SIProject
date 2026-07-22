import { Router } from "express"
import AuthController from "../controllers/AuthController"
import { body, param } from "express-validator"
import { handleInputErrors } from "../middleware/validation"
import { authenticate, isAdmin } from "../middleware/auth";

const router = Router()

router.post("/create_account",

    body("name").notEmpty().withMessage("El nombre no puede estar vacío"),

    body("password").isLength({min: 8}).withMessage("La contraseña debe tener mínimo 8 caracteres"),

    body("password_confirmation").custom((value, {req}) => {
        if( value !== req.body.password ) {
            throw new Error("Las contraseñas no son iguales")
        } else {
            return true
        }
    }),

    body("email").isEmail().withMessage("El correo no es válido"),

    handleInputErrors,

    AuthController.createAccount
)

router.post("/confirm_account",
    body("token").notEmpty().withMessage("El nombre no puede estar vacío")
                .isLength({min: 6}).withMessage("La contraseña debe tener mínimo 8 caracteres")
                .isAlphanumeric().withMessage("El token solo contiene números"),
    
    handleInputErrors,

    AuthController.confirmAccount
)

router.post("/login",
    
    body("password").notEmpty().withMessage("La contraseña no puede estar vacía"),

    body("email").isEmail().withMessage("El correo no es válido"),

    handleInputErrors,

    AuthController.loginAccount
)

router.post("/request_code",

    body("email").isEmail().withMessage("El correo no es válido"),

    handleInputErrors,

    AuthController.requestConfirmAccount
)

router.post("/forgot_password",

    body("email").isEmail().withMessage("El correo no es válido"),

    handleInputErrors,

    AuthController.forgotPassword
)

router.post("/validate_token",

    body("token").notEmpty().withMessage("El nombre no puede estar vacío")
                .isLength({min: 6}).withMessage("El token debe tener mínimo 6 caracteres")
                .isAlphanumeric().withMessage("El token solo contiene números"),

    handleInputErrors,

    AuthController.validateNewPasswordToken
)

router.post("/update_password/:token",

    param("token").isNumeric().withMessage("Token no válido"),

    body("password").isLength({min: 8}).withMessage("La contraseña debe tener mínimo 8 caracteres"),

    body("password_confirmation").custom((value, {req}) => {
        if( value !== req.body.password ) {
            throw new Error("Las contraseñas no son iguales")
        } else {
            return true
        }
    }),

    handleInputErrors,

    AuthController.updatePasswordWithToken
)

router.get("/user", 
    authenticate,

    AuthController.user
)

router.patch("/users/:userId/role",
    authenticate,
    isAdmin,
    param("userId").isMongoId().withMessage("ID de usuario no válido"),
    body("role").notEmpty().withMessage("El rol no puede estar vacío")
                .isIn(["regular", "admin"]).withMessage("El rol debe ser regular o admin"),
    handleInputErrors,
    AuthController.updateUserRole
)

export default router