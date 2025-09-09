import { z } from "zod";

const userSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type UserModel = z.infer<typeof userSchema>;
export default userSchema;
