import { Router } from "express";
import BlobController from "../../controllers/blobController";
import { StorageType } from "../../utils/enums/storageEnums";
import config from "../../config/config";
import { isAuthenticated } from "../../middleware/authMiddleware";
const router = Router();
const blobController = new BlobController();

// Apply the middleware to all blob routes

switch (config.storageType) {
  case StorageType.S3:
    router.get(`/:id`, isAuthenticated, (req, res) =>
      blobController.getBlobFromS3(req, res)
    );
    router.post(`/`, isAuthenticated, (req, res) =>
      blobController.putBlobToS3(req, res)
    );
    break;
  case StorageType.DATABASE:
    router.get(`/:id/`, isAuthenticated, (req, res) =>
      blobController.getBlobFromDatabase(req, res)
    );
    router.post(`/`, isAuthenticated, (req, res) =>
      blobController.createBlobInDatabase(req, res)
    );
    break;
  case StorageType.LOCAL:
    router.post(`/`, isAuthenticated, (req, res) =>
      blobController.saveBlobToLocalStorage(req, res)
    );
    router.get(`/:id`, isAuthenticated, (req, res) =>
      blobController.getBlobFromLocalStorage(req, res)
    );
    break;
}

export default router;
