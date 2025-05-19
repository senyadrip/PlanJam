import { Router } from "express";
import { createJam, getAllJams, deleteJam, getJam, updateJam } from "../controllers/JamController";

const router = Router();

router.get("/", getAllJams);
router.post("/", createJam);
router.delete("/:id", deleteJam);
router.get("/:id", getJam);
router.put("/:id", updateJam);

export default router;