import { loginController, signupController } from "@/controller/auth";
import { Router } from "express";

const router = Router();

router.post("/register", signupController);
router.post("/login", loginController);

export const authRouter = router;
