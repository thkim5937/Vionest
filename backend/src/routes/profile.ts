import { Router } from "express";
import { getMyProfile, upsertProfile } from "../controllers/profile.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/", requireAuth, upsertProfile);
router.put("/", requireAuth, upsertProfile);
router.get("/me", requireAuth, getMyProfile);

export default router;
