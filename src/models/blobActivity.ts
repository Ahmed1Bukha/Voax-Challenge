import { z } from "zod";

const blobActivityModel = z.object({
  blobId: z.string(),
  action: z.string(),
  success: z.boolean(),
  metadata: z.object({
    url: z.string().optional(),
    userAgent: z.string().optional(),
    ip: z.string().optional(),
    timestamp: z.string().optional(),
  }),
});

export type BlobActivityModel = z.infer<typeof blobActivityModel>;
