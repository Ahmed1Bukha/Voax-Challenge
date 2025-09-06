import { Router } from "express";
import config from "../../config";
import BlobController from "../../controllers/blobController";

const router = Router();
const blobController = new BlobController();
router.get(`/:id`, blobController.getBlob);

router.get(`/`, (req, res) => {
  res.send("Hello from Blob");
});

router.post(`/`, blobController.createBlob);

export default router;
