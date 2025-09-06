import { Router } from "express";
import BlobController from "../../controllers/blobController";
import { saveBlobActivity } from "../../middleware/blobMiddleware";

const router = Router();
const blobController = new BlobController();

// Apply the middleware to all blob routes
router.use(saveBlobActivity);

router.get(`/:id/s3`, (req, res) => blobController.getBlobFromS3(req, res));
router.post(`/s3`, (req, res) => blobController.putBlobToS3(req, res));
router.get("/:id/database", (req, res) =>
  blobController.getBlobFromDatabase(req, res)
);
router.post("/database", (req, res) =>
  blobController.createBlobInDatabase(req, res)
);
router.post("/local", (req, res) =>
  blobController.saveBlobToLocalStorage(req, res)
);
router.get("/:id/local", (req, res) =>
  blobController.getBlobFromLocalStorage(req, res)
);
export default router;
