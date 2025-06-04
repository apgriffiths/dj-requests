"use client";

import RequestQueueSong from "./request-queue-song";
import { getRequests } from "@/app/lib/actions";
//import postgres from "postgres";
import { useEffect, useState } from "react";
import { SongRequest } from "../../lib/definitions";

export default function RequestQueue() {
  const [requests, setRequests] = useState<SongRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await getRequests();
      if (!response.success || (response.data?.length ?? 0) === 0) {
        console.warn("No requests found or response is empty.");
        setRequests([]);
        return;
      }
      setRequests(response?.data || []);
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
      <h2 className="text-cyan-100 text-xl mb-4 text-center">Request Queue</h2>

      <div className="space-y-3">
        {/*<!-- Queue Items -->*/}
        <RequestQueueSong
          songName={requests[0]?.trackname}
          artist={requests[0]?.artist}
          orderNum="Next"
          loading={loading}
        />
        <RequestQueueSong
          songName={requests[1]?.trackname}
          artist={requests[1]?.artist}
          orderNum="#2"
          loading={loading}
        />
        <RequestQueueSong
          songName={requests[2]?.trackname}
          artist={requests[2]?.artist}
          orderNum="#3"
          loading={loading}
        />
        <RequestQueueSong
          songName={requests[3]?.trackname}
          artist={requests[3]?.artist}
          orderNum="#4"
          loading={loading}
        />
      </div>
    </div>
  );
}
