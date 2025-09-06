import { Router } from "express";
import BlobController from "../../controllers/blobController";
import { saveBlobActivity } from "../../middleware/blobMiddleware";

const router = Router();
const blobController = new BlobController();

// Apply the middleware to all blob routes
router.use(saveBlobActivity);

router.get(`/:id`, (req, res) => blobController.getBlobFromS3(req, res));
router.post(`/`, (req, res) => blobController.putBlobToS3(req, res));
export default router;
