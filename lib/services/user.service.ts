import { PrismaClient } from "@prisma/client";

export class UserService {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async createUser() {}
}
