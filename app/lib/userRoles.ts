import { PrismaClient } from "@prisma/client";

// Create a global Prisma client instance for serverless
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export interface UserWithRole {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
}

export async function updateUserRole(
  userId: string,
  newRole: string
): Promise<UserWithRole> {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
}

export async function getUsersByRole(role: string): Promise<UserWithRole[]> {
  try {
    const users = await prisma.user.findMany({
      where: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    return users;
  } catch (error) {
    console.error("Error fetching users by role:", error);
    throw error;
  }
}

export async function getAllUsers(): Promise<UserWithRole[]> {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return users;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
}
