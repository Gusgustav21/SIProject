import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import dns from "node:dns"
import morgan from "morgan"
import { connectDB } from "./config/db"
import eventRoutes from "./routes/eventRoutes"
import spaceRoutes from "./routes/spaceRoutes"
import authRoutes from "./routes/authRoutes"
import { corsConfig } from "./config/cors"

dotenv.config()

const dnsServers = process.env.DNS_SERVERS?.split(",").map(s => s.trim()).filter(Boolean)
if (dnsServers?.length) {
    dns.setServers(dnsServers)
}

connectDB()

const app = express()

app.use(cors(corsConfig))

app.use(morgan("dev"))

app.use(express.json())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/events", eventRoutes)
app.use("/api/spaces", spaceRoutes)

export default app