import { Router } from "express"
import { body, param } from "express-validator"
import { SpaceController } from "../controllers/SpaceController"
import { handleInputErrors } from "../middleware/validation"
import spaceExists from "../middleware/space"
import { authenticate, isAdmin } from "../middleware/auth"
import { spaceTypes } from "../models/Space"

const router = Router()

// All routes require authentication
router.use(authenticate)

// Get all spaces
router.get("/", SpaceController.getAllSpaces)

// Parameter matching
router.param("spaceId", spaceExists)

// Get space by id
router.get("/:spaceId",
    param("spaceId").isMongoId().withMessage("ID del espacio no válido"),
    handleInputErrors,
    SpaceController.getSpaceById
)

// Admin-only actions: create, update, delete
router.post("/",
    isAdmin,
    body("nombre").notEmpty().withMessage("El nombre del espacio no puede estar vacío"),
    body("capacidad").isInt({ min: 1 }).withMessage("La capacidad debe ser un número entero mayor o igual a 1"),
    body("tipo").notEmpty().withMessage("El tipo de espacio no puede estar vacío")
                .custom(type => Object.values(spaceTypes).includes(type))
                .withMessage("El tipo de espacio no es válido"),
    body("ubicacion").notEmpty().withMessage("La ubicación del espacio no puede estar vacía"),
    handleInputErrors,
    SpaceController.createSpace
)

router.put("/:spaceId",
    isAdmin,
    param("spaceId").isMongoId().withMessage("ID del espacio no válido"),
    body("nombre").optional().notEmpty().withMessage("El nombre del espacio no puede estar vacío"),
    body("capacidad").optional().isInt({ min: 1 }).withMessage("La capacidad debe ser un número entero mayor o igual a 1"),
    body("tipo").optional().notEmpty().withMessage("El tipo de espacio no puede estar vacío")
                .custom(type => Object.values(spaceTypes).includes(type))
                .withMessage("El tipo de espacio no es válido"),
    body("ubicacion").optional().notEmpty().withMessage("La ubicación del espacio no puede estar vacía"),
    handleInputErrors,
    SpaceController.updateSpace
)

router.delete("/:spaceId",
    isAdmin,
    param("spaceId").isMongoId().withMessage("ID del espacio no válido"),
    handleInputErrors,
    SpaceController.deleteSpace
)

export default router
