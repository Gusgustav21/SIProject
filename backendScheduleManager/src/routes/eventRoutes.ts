import { Router } from "express"
import { body, param } from "express-validator"
import { EventController } from "../controllers/EventController"
import { handleInputErrors } from "../middleware/validation"
import eventExists from "../middleware/event"
import { authenticate, isAdmin } from "../middleware/auth"
import { eventStatus } from "../models/Event"

const router = Router()

// All routes require authentication
router.use(authenticate)

router.post("/",
    body("titulo").notEmpty().withMessage("El título del evento no puede estar vacío"),
    body("espacioId").isMongoId().withMessage("ID de espacio no válido"),
    body("responsable").notEmpty().withMessage("El responsable del evento no puede estar vacío"),
    body("fecha").notEmpty().withMessage("La fecha del evento no puede estar vacía"),
    body("horaInicio").notEmpty().withMessage("La hora de inicio del evento no puede estar vacía"),
    body("horaFin").notEmpty().withMessage("La hora de fin del evento no puede estar vacía"),
    body("asistentes").isInt({ min: 1 }).withMessage("El número de asistentes debe ser un entero mayor o igual a 1"),
    handleInputErrors,
    EventController.createEvent
)

router.get("/", EventController.getAllEvents)

// Parameter matching
router.param("eventId", eventExists)

router.get("/:eventId",
    param("eventId").isMongoId().withMessage("ID del evento no válido"),
    handleInputErrors,
    EventController.getEventById
)

router.put("/:eventId",
    param("eventId").isMongoId().withMessage("ID del evento no válido"),
    body("titulo").optional().notEmpty().withMessage("El título del evento no puede estar vacío"),
    body("espacioId").optional().isMongoId().withMessage("ID de espacio no válido"),
    body("responsable").optional().notEmpty().withMessage("El responsable del evento no puede estar vacío"),
    body("fecha").optional().notEmpty().withMessage("La fecha del evento no puede estar vacía"),
    body("horaInicio").optional().notEmpty().withMessage("La hora de inicio del evento no puede estar vacía"),
    body("horaFin").optional().notEmpty().withMessage("La hora de fin del evento no puede estar vacía"),
    body("asistentes").optional().isInt({ min: 1 }).withMessage("El número de asistentes debe ser un entero mayor o igual a 1"),
    handleInputErrors,
    EventController.updateEvent
)

// Admin-only actions
router.patch("/:eventId/status",
    isAdmin,
    param("eventId").isMongoId().withMessage("ID del evento no válido"),
    body("estado").notEmpty().withMessage("El estado del evento no puede estar vacío")
                  .custom(status => Object.values(eventStatus).includes(status))
                  .withMessage("El estado del evento no es válido"),
    handleInputErrors,
    EventController.patchStatusEvent
)

router.delete("/:eventId",
    isAdmin,
    param("eventId").isMongoId().withMessage("ID del evento no válido"),
    handleInputErrors,
    EventController.deleteEvent
)

export default router
