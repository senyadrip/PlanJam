import { Router } from "express";
import { createJam } from "../controllers/JamController";

const router = Router();

router.post("/", createJam);

export default router;