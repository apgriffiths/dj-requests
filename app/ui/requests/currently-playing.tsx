"use client";

import { useState, useEffect } from "react";
import { getCurrentSong } from "@/app/lib/actions";

export default function CurrentlyPlaying() {
  const [loading, setLoading] = useState(true);
  const [currentlyPlaying, setCurrentlyPlaying] = useState("Loading......");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      //const response: SongRequest[] = await getCurrentSong();
      getCurrentSong()
        .then((response) => {
          if (response.success && response.data) {
            if (response.data.length > 0) {
              const { trackname, artist } = response.data[0];
              setCurrentlyPlaying(
                `${trackname}` + (artist ? ` by ${artist}` : "")
              );
              return response.data;
            } else {
              setCurrentlyPlaying("No song is currently playing.");
              return [];
            }
          } else {
            throw new Error(response.error || "Failed to fetch current song");
          }
        })
        .catch((error) => {
          console.error("Error fetching current song:", error);
          return [];
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="w-full max-w-md mt-8 bg-black bg-opacity-50 rounded-xl p-6 border-2 neon-border">
      <h2 className="text-cyan-100 text-xl mb-4 text-center">
        Currently Playing
      </h2>
      <p className="text-white text-center font-bold mt-1">
        {!loading ? currentlyPlaying : "Loading..."}
      </p>
    </div>
  );
}
