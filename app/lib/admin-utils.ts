import { prisma } from "@/app/lib/prisma";
//import { Role } from "@prisma/client"

export async function promoteUserToAdmin(userEmail: string) {
  try {
    const user = await prisma.user.update({
      where: { email: userEmail },
      data: { role: "ADMIN" },
    });

    console.log(`User ${userEmail} promoted to admin`);
    return user;
  } catch (error) {
    console.error("Error promoting user to admin:", error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });
}

export async function getAllUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

// Script to run via npm script to promote first admin
// Usage: npx tsx scripts/create-admin.ts your-email@example.com
export async function createFirstAdmin(email: string) {
  const user = await getUserByEmail(email);

  if (!user) {
    console.log(`User with email ${email} not found. Please sign in first.`);
    return;
  }

  if (user.role === "ADMIN") {
    console.log(`User ${email} is already an admin.`);
    return user;
  }

  return await promoteUserToAdmin(email);
}
