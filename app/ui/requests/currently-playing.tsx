"use client";

import { useState, useEffect } from "react";
import { getCurrentSong } from "@/app/lib/actions";
import postgres from "postgres";

export default function CurrentlyPlaying() {
  const [loading, setLoading] = useState(true);
  const [currentlyPlaying, setCurrentlyPlaying] = useState("Loading......");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response: postgres.Row[] = await getCurrentSong();
      if (response.length > 0) {
        const { trackname, artist } = response[0];
        setCurrentlyPlaying(`${trackname}` + (artist ? `by ${artist}` : ""));
      } else {
        setCurrentlyPlaying("No song is currently playing.");
      }
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
