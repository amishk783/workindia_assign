import {
  bookSeatController,
  createTrainController,
  getAllTrains,
  getBookingDetails,
} from "@/controller/train";
import { verifyRole, verifyUser } from "@/middleware/verifyUser";
import { Router } from "express";

const router = Router();

router.post("/trains/:id", verifyUser, bookSeatController);
router.get("/booking/:id", verifyUser, getBookingDetails);
router.get("/trains", verifyUser, getAllTrains);

router.post(
  "/admin/trains/",
  verifyUser,
  verifyRole(["admin"]),
  createTrainController
);

export const trainRouter = router
