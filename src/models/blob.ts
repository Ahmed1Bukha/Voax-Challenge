import { z } from "zod";

const blobSchema = z.object({
  id: z.string(),
  data: z.base64(),
  createdAt: z.date().default(new Date()),
  size: z.number().optional(),
});

export default blobSchema;
