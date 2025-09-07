import { z } from "zod";
import { StorageType } from "../utils/enums/storageEnums";

const blobMetadataSchema = z.object({
  id: z.string(),
  storageType: z.enum(StorageType),
  metadata: z.object({
    size: z.number(),
    createdAt: z.date(),
  }),
});

export type BlobMetadataModel = z.infer<typeof blobMetadataSchema>;
