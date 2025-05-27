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
  };
  message?: string | null;
};

const FormSchema = z.object({
  id: z.string(),
  trackName: z.string({ required_error: "Please add a track name." }),
  artist: z.string(),
  isPremium: z.boolean({
    invalid_type_error: "Please select a request type.",
  }),
  isPlaying: z.boolean(),
  date: z.string(),
  isPlayed: z.boolean().optional(),
});

const CreateRequest = FormSchema.omit({
  id: true,
  isPlaying: true,
  date: true,
  isPremium: true,
  isPlayed: true,
});

export async function createRequest(prevState: State, formData: FormData) {
  const validatedFields = CreateRequest.safeParse({
    trackName: formData.get("trackName"),
    artist: formData.get("artist"),
  });
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message:
        "Oops, there has been a problem. Please make sure that you complete the form correctly.",
    };
  }
  const { trackName, artist } = validatedFields.data;
  const date = new Date();
  const isPremium = false; // Default to false for non-premium requests
  try {
    const result = await sql`
    INSERT INTO requests (trackName, artist, isPremium, date)
    VALUES (${trackName}, ${artist}, ${isPremium}, ${date}) 
    RETURNING trackName
  `;
    return result[0].trackname
      ? {
          message: `Your request for "${result[0].trackname}" has been sent successfully.`,
        }
      : { message: "Oops, there has been a problem. Please try again." };
  } catch (error) {
    console.error(error);
  }

  revalidatePath("/requests");
  redirect("/requests");
}

export async function getRequests() {
  try {
    // TODO Limit to 4 results
    const requests = await sql`
      SELECT * FROM requests
      WHERE requests.isplayed = false
      AND requests.isplaying = false
      ORDER BY requests.date ASC
    `;
    return requests || [];
  } catch (error) {
    console.error("Error fetching requests:", error);
    return [];
  }
}

export async function getCurrentSong() {
  try {
    const currentSong = await sql`
      SELECT * FROM requests
      WHERE requests.isplaying = true
    `;
    return currentSong || [];
  } catch (error) {
    console.error("Error fetching requests:", error);
    return [];
  }
}
