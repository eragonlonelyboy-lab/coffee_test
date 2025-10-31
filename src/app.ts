import express from "express";
import cors from "cors";
import morgan from "morgan";

// Import routers
import userRoutes from "./modules/users/routes";
import menuRoutes from "./modules/menu/routes";
import orderRoutes from "./modules/orders/routes";
import paymentRoutes from "./modules/payments/routes";
import loyaltyRoutes from "./modules/loyalty/routes";
import missionRoutes from "./modules/missions/routes";
import reviewRoutes from "./modules/reviews/routes";
import promotionsRoutes from "./modules/promotions/routes";
import referralsRoutes from "./modules/referrals/routes";
import notificationsRoutes from "./modules/notifications/routes";
import reportsRoutes from "./modules/reports/routes";

const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to LoyalBrew API" });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/users", userRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/loyalty", loyaltyRoutes);
app.use("/api/missions", missionRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/promotions", promotionsRoutes);
app.use("/api/referrals", referralsRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/reports", reportsRoutes);

export default app;