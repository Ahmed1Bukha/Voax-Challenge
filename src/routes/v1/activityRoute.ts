import { Router } from "express";
import ActivityController from "../../controllers/activityController";

const router = Router();
const activityController = new ActivityController();

router.get(`/`, (req, res) => activityController.getBlobActivity(req, res));

export default router;
