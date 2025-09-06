import { z } from "zod";

const blobSchema = z.object({
  id: z.string(),
  data: z.string().refine((val) => {
    // Basic base64 validation
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    return base64Regex.test(val);
  }, "Invalid base64 string"),
  createdAt: z.date().default(() => new Date()),
  size: z.number().optional(),
});

export default blobSchema;
