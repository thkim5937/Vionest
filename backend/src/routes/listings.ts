import { Router } from "express";
import { createListing, getListing, listListings } from "../controllers/listings.controller";
import { requireAuth } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

router.post("/", requireAuth, upload.array("photos"), createListing);
router.get("/", requireAuth, listListings);
router.get("/:id", requireAuth, getListing);

export default router;
