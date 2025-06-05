"use server";

import { z } from "zod";
import postgres from "postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  SongRequest,
  // CreateSongRequestInput,
  UpdateSongRequestInput,
} from "./definitions";

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
  date: z.string(),
  status: z.enum(["pending", "playing", "played"], {
    required_error: "Please select a status.",
  }),
  isarchived: z.boolean(),
});

const CreateRequest = FormSchema.omit({
  id: true,
  date: true,
  isPremium: true,
  status: true,
  isarchived: true,
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

export async function getRequests(): Promise<{
  success: boolean;
  data?: SongRequest[];
  error?: string;
}> {
  try {
    console.log("URL string", process.env.POSTGRES_URL);
    const requests = await sql<SongRequest[]>`
      SELECT * FROM requests
      WHERE requests.isarchived = false
      ORDER BY requests.date ASC
      LIMIT 4
    `;
    return { success: true, data: requests };
  } catch (error) {
    console.error("Error fetching requests:", error);
    return { success: false, error: "Failed to fetch requests" };
  }
}

export async function getCurrentSong(): Promise<{
  success: boolean;
  data?: SongRequest[];
  error?: string;
}> {
  try {
    const currentSong = await sql<SongRequest[]>`
      SELECT * FROM requests
      WHERE requests.status = 'playing'
      ORDER BY requests.date DESC
      LIMIT 1
    `;
    return { success: true, data: currentSong };
  } catch (error) {
    console.error("Error fetching requests:", error);
    return { success: false, error: "Failed to fetch current song" };
  }
}

// READ - Get all song requests
export async function getSongRequests(): Promise<{
  success: boolean;
  data?: SongRequest[];
  error?: string;
}> {
  try {
    const result = await sql<SongRequest[]>`
      SELECT * FROM requests
      WHERE requests.isarchived = false
      ORDER BY requests.date ASC
    `;
    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching song requests:", error);
    return { success: false, error: "Failed to fetch song requests" };
  }
}
// UPDATE - Update a song request
export async function updateSongRequest(
  id: string,
  data: UpdateSongRequestInput
): Promise<{ success: boolean; data?: SongRequest; error?: string }> {
  try {
    if (
      typeof data.trackname !== "string" ||
      typeof data.artist !== "string" ||
      typeof data.status !== "string" ||
      typeof data.ispremium !== "boolean" ||
      typeof data.isarchived !== "boolean"
    ) {
      return { success: false, error: "Invalid input data for update." };
    }

    const result: SongRequest[] = await sql<SongRequest[]>`
      UPDATE requests
      SET 
        trackName = ${data.trackname.trim()},
        artist = ${data.artist.trim()},
        status = ${data.status},
        isPremium = ${data.ispremium},
        isarchived = ${data.isarchived}
      WHERE id = ${id}
      RETURNING *
    `;

    // Revalidate the page
    revalidatePath("/song-requests");

    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Error updating song request:", error);
    return { success: false, error: "Failed to update song request" };
  }
}
/*
// UPDATE - Bulk update song request statuses
export async function bulkUpdateSongRequests(
  updates: { id: string; status: SongRequest["status"] }[]
): Promise<{ success: boolean; data?: SongRequest[]; error?: string }> {
  try {
    const updatedRequests: SongRequest[] = [];

    for (const { id, status } of updates) {
      const result = await updateSongRequest(id, { status });
      if (result.success && result.data) {
        updatedRequests.push(result.data);
      }
    }

    return { success: true, data: updatedRequests };
  } catch (error) {
    console.error("Error bulk updating song requests:", error);
    return { success: false, error: "Failed to bulk update song requests" };
  }
}

// DELETE - Delete a song request
export async function deleteSongRequest(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const requestIndex = songRequests.findIndex((req) => req.id === id);

    if (requestIndex === -1) {
      return { success: false, error: "Song request not found" };
    }

    // Check if request can be deleted (e.g., not currently playing)
    const request = songRequests[requestIndex];
    if (request.status === "playing") {
      return {
        success: false,
        error: "Cannot delete a currently playing song",
      };
    }

    songRequests.splice(requestIndex, 1);

    // Revalidate the page
    revalidatePath("/song-requests");

    return { success: true };
  } catch (error) {
    console.error("Error deleting song request:", error);
    return { success: false, error: "Failed to delete song request" };
  }
}

// DELETE - Bulk delete song requests
export async function bulkDeleteSongRequests(
  ids: string[]
): Promise<{ success: boolean; deleted?: number; error?: string }> {
  try {
    let deletedCount = 0;

    for (const id of ids) {
      const result = await deleteSongRequest(id);
      if (result.success) {
        deletedCount++;
      }
    }

    return { success: true, deleted: deletedCount };
  } catch (error) {
    console.error("Error bulk deleting song requests:", error);
    return { success: false, error: "Failed to bulk delete song requests" };
  }
}

// UTILITY - Get song request statistics
export async function getSongRequestStats(): Promise<{
  success: boolean;
  data?: {
    total: number;
    pending: number;
    approved: number;
    playing: number;
    played: number;
    rejected: number;
    premium: number;
  };
  error?: string;
}> {
  try {
    const stats = {
      total: songRequests.length,
      pending: songRequests.filter((req) => req.status === "pending").length,
      approved: songRequests.filter((req) => req.status === "approved").length,
      playing: songRequests.filter((req) => req.status === "playing").length,
      played: songRequests.filter((req) => req.status === "played").length,
      rejected: songRequests.filter((req) => req.status === "rejected").length,
      premium: songRequests.filter((req) => req.premium).length,
    };

    return { success: true, data: stats };
  } catch (error) {
    console.error("Error getting song request stats:", error);
    return { success: false, error: "Failed to get statistics" };
  }
}

// UTILITY - Clear old played/rejected requests
export async function cleanupOldRequests(
  olderThanHours: number = 24
): Promise<{ success: boolean; deleted?: number; error?: string }> {
  try {
    const cutoffTime = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);
    const initialCount = songRequests.length;

    songRequests = songRequests.filter((req) => {
      const requestTime = new Date(req.createdAt);
      // Keep requests that are not old OR are not played/rejected
      return (
        requestTime > cutoffTime || !["played", "rejected"].includes(req.status)
      );
    });

    const deletedCount = initialCount - songRequests.length;

    if (deletedCount > 0) {
      revalidatePath("/song-requests");
    }

    return { success: true, deleted: deletedCount };
  } catch (error) {
    console.error("Error cleaning up old requests:", error);
    return { success: false, error: "Failed to cleanup old requests" };
  }
}
 */
