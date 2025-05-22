"use server";

import { z } from "zod";
import postgres from "postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export type State = {
  errors?: {
    trackName?: string[];
    artist?: string[];
    isPremium?: string[];
  };
  message?: string | null;
};

const FormSchema = z.object({
  id: z.string(),
  trackName: z.string({ invalid_type_error: "Please add a track name." }),
  artist: z.string({ invalid_type_error: "Please add an artist name." }),
  isPremium: z.boolean({
    invalid_type_error: "Please select a request type.",
  }),
  date: z.string(),
});

const CreateRequest = FormSchema.omit({ id: true, date: true });

export async function createRequest(prevState: State, formData: FormData) {
  const validatedFields = CreateRequest.safeParse({
    trackName: formData.get("trackName"),
    artist: formData.get("artist"),
    isPremium: formData.get("isPremium"),
  });
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Request.",
    };
  }
  const { trackName, artist, isPremium } = validatedFields.data;
  const date = new Date();
  try {
    await sql`
    INSERT INTO invoices (trackName, artist, isPremium, date)
    VALUES (${trackName}, ${artist}, ${isPremium}, ${date})
  `;
  } catch (error) {
    console.error(error);
  }

  revalidatePath("/requests");
  redirect("/requests");
}
