import passport from "passport";
import DatabaseServices from "./databaseServices";

export default class AuthService {
  private databaseServices: DatabaseServices;
  constructor() {
    this.databaseServices = new DatabaseServices();
  }

  registerUser = async (email: string, password: string) => {
    const existingUser = await this.databaseServices.getUserByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const user = await this.databaseServices.createUser({ email, password });
    return user;
  };
}
