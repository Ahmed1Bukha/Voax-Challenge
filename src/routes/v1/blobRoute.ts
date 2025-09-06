import { Router } from "express";
import BlobController from "../../controllers/blobController";

const router = Router();
const blobController = new BlobController();
router.get(`/:id`, (req, res) => blobController.getBlob(req, res));

router.get(`/`, (req, res) => {
  res.send("Hello from Blob");
});

router.post(`/`, (req, res) => blobController.createBlob(req, res));

router.get(`/bucket/:key`, (req, res) =>
  blobController.getBlobFromS3(req, res)
);

router.put(`/bucket`, (req, res) => blobController.putBlobToS3(req, res));

export default router;
