"use client";

//import { useState, useEffect } from "react";

export default function RequestQueueSong({
  songName,
  artist,
  orderNum,
  loading,
}: {
  songName: string;
  artist: string;
  orderNum: string;
  loading?: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-blue-900 bg-opacity-30 rounded-lg border border-cyan-800">
      <div>
        <p className="text-white font-bold">
          {loading ? "Loading..." : songName}
        </p>
        <p className="text-cyan-200 text-sm">{loading ? "..." : artist}</p>
      </div>
      <span className="text-cyan-100 text-sm">
        {loading ? "..." : orderNum}
      </span>
    </div>
  );
}
