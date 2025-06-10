import { createFirstAdmin } from "../app/lib/admin-utils";

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.log(
      "Usage: npx tsx scripts/create-admin.ts your-email@example.com"
    );
    process.exit(1);
  }

  try {
    await createFirstAdmin(email);
    console.log("Admin creation completed");
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();
