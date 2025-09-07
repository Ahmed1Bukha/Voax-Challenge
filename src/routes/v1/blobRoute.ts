import { Router } from "express";
import BlobController from "../../controllers/blobController";
import { StorageType } from "../../utils/enums/storageEnums";
import config from "../../config/config";

const router = Router();
const blobController = new BlobController();

// Apply the middleware to all blob routes

switch (config.storageType) {
  case StorageType.S3:
    router.get(`/:id`, (req, res) => blobController.getBlobFromS3(req, res));
    router.post(`/`, (req, res) => blobController.putBlobToS3(req, res));
    break;
  case StorageType.DATABASE:
    router.get(`/:id/`, (req, res) =>
      blobController.getBlobFromDatabase(req, res)
    );
    router.post(`/`, (req, res) =>
      blobController.createBlobInDatabase(req, res)
    );
    break;
  case StorageType.LOCAL:
    router.post(`/`, (req, res) =>
      blobController.saveBlobToLocalStorage(req, res)
    );
    router.get(`/:id`, (req, res) =>
      blobController.getBlobFromLocalStorage(req, res)
    );
    break;
}

export default router;
