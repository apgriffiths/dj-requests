"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronUp,
  ChevronDown,
  Search,
  Filter,
  Play,
  Check,
  X,
  Clock,
  Music,
  Zap,
  CircleStop,
  ArchiveX,
} from "lucide-react";
import { getSongRequests, updateSongRequest } from "@/app/lib/actions";
import { SongRequest, UpdateSongRequestInput } from "@/app/lib/definitions";
import { toast } from "react-hot-toast";

const SongRequestTable = () => {
  const [sortField, setSortField] = useState<keyof SongRequest>("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [requests, setRequests] = useState<SongRequest[]>([]);
  //const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    //setLoading(true);
    try {
      const response = await getSongRequests();
      if (!response.success || (response.data?.length ?? 0) === 0) {
        console.warn("No requests found or response is empty.");
        toast.error("No requests found.");
        setRequests([]);
        return;
      }
      setRequests(response?.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch requests.");
    }
    // Add finally block for setLoading if needed
  };
  useEffect(() => {
    fetchRequests();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case "approved":
        return <Check className="w-4 h-4 text-cyan-400" />;
      case "playing":
        return <Play className="w-4 h-4 text-blue-400" />;
      case "played":
        return <Check className="w-4 h-4 text-gray-400" />;
      case "rejected":
        return <X className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/50 shadow-yellow-500/20";
      case "approved":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-cyan-500/20";
      case "playing":
        return "bg-blue-500/20 text-blue-300 border-blue-500/50 shadow-blue-500/30 animate-pulse";
      case "played":
        return "bg-gray-500/20 text-gray-300 border-gray-500/50";
      case "rejected":
        return "bg-red-500/20 text-red-300 border-red-500/50";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/50";
    }
  };

  const handleArchive = (id: string) => {
    console.log(`Archiving request with ID: ${id}`);
    const songRequest = requests.find((req) => req.id === id);
    if (!songRequest) {
      console.error(`Request with ID ${id} not found.`);
      toast.error(`Request with not found.`);
      return;
    }
    const updatedRequest: UpdateSongRequestInput = {
      ...songRequest,
      isarchived: true,
    };
    updateSongRequest(id, updatedRequest)
      .then((response) => {
        if (response.success) {
          const indexToRemove = requests.findIndex((obj) => obj.id === id);
          if (indexToRemove !== -1) {
            requests.splice(indexToRemove, 1);
          }
          setRequests(requests);
          toast.success(`Request ${id} archived successfully.`);
          console.log(`Request ${id} archived successfully.`);
        } else {
          toast.error(`Failed to archive request.`);
          console.error(`Failed to archive request ${id}:`, response.error);
        }
      })
      .catch((error) => {
        toast.error(`Error archiving request.`);
        console.error(`Error archiving request ${id}:`, error);
      });
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field as keyof SongRequest);
      setSortDirection("asc");
    }
  };

  const handleStatusChange = (
    id: string,
    newStatus: "pending" | "playing" | "played"
  ) => {
    const checkForPlayingStatus = requests.some(
      (req) => req.status === "playing" && req.id !== id // Ensure only one request can be "playing" at a time
    );
    if (newStatus === "playing" && checkForPlayingStatus) {
      toast.error(
        "Another request is already playing. Please update that first."
      );
      return;
    }
    const songRequest = requests.find((req) => req.id === id);
    if (!songRequest) {
      console.error(`Request with ID ${id} not found.`);
      toast.error(`Request not found.`);
      return;
    }
    const updatedRequest: UpdateSongRequestInput = {
      ...songRequest,
      status: newStatus,
    };
    // Call the updateSongRequest function with the updated request
    updateSongRequest(id, updatedRequest)
      .then((response) => {
        if (response.success) {
          setRequests(
            requests.map((req) =>
              req.id === id ? { ...req, status: newStatus } : req
            )
          );
          console.log(`Request ${id} updated successfully.`);
          toast.success(`Request updated successfully.`);
        } else {
          console.error(`Failed to update request ${id}:`, response.error);
          toast.error(`Failed to update request.`);
        }
      })
      .catch((error) => {
        console.error(`Error updating request ${id}:`, error);
        toast.error(`Error updating request.`);
      });
  };

  const filteredAndSortedRequests = requests
    .filter((req) => {
      const matchesSearch =
        searchTerm === "" ||
        req.trackname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.artist.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterStatus === "all" || req.status === filterStatus;

      return matchesSearch && matchesFilter;
    })
    .sort((a: SongRequest, b: SongRequest) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (sortField === "date") {
        const aDate = new Date(aValue as string);
        const bDate = new Date(bValue as string);
        if (sortDirection === "asc") {
          return aDate > bDate ? 1 : -1;
        } else {
          return aDate < bDate ? 1 : -1;
        }
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const formatTime = (timestamp: string | number | Date) => {
    return new Date(timestamp).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="w-full bg-black/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-cyan-500/20 overflow-hidden">
        {/* Neon glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 opacity-30 blur-xl"></div>

        {/* Header */}
        <div className="relative p-8 border-b border-cyan-500/30 bg-gradient-to-r from-blue-900/30 to-cyan-900/30">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="relative">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2 tracking-wide">
                SONG REQUESTS
              </h2>
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg blur opacity-25"></div>
              <p className="relative text-cyan-300/80 text-lg font-medium">
                {filteredAndSortedRequests.length} LIVE REQUESTS
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative flex items-center">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400 w-5 h-5 z-10" />
                  <input
                    type="text"
                    placeholder="Search the dancefloor..."
                    className="relative pl-12 pr-6 py-3 bg-black/50 border border-cyan-500/50 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition-all duration-300 w-full sm:w-80 text-white placeholder-cyan-300/60 backdrop-blur-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative flex items-center">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5 z-10" />
                  <select
                    className="relative pl-12 pr-10 py-3 bg-black/50 border border-blue-500/50 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all duration-300 appearance-none text-white backdrop-blur-sm cursor-pointer"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all" className="bg-gray-900">
                      All Tracks
                    </option>
                    <option value="pending" className="bg-gray-900">
                      Pending
                    </option>
                    <option value="playing" className="bg-gray-900">
                      Now Playing
                    </option>
                    <option value="played" className="bg-gray-900">
                      Played
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="relative overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-900/80 to-blue-900/80 border-b border-cyan-500/30">
              <tr>
                <th className="px-6 py-5 text-left">
                  <button
                    onClick={() => handleSort("title")}
                    className="flex items-center gap-3 font-bold text-cyan-300 hover:text-cyan-200 transition-colors text-sm uppercase tracking-wider group"
                  >
                    <Music className="w-4 h-4" />
                    Track
                    {sortField.toString() === "trackname" && (
                      <span className="text-cyan-400">
                        {sortDirection === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </span>
                    )}
                  </button>
                </th>
                <th className="px-6 py-5 text-left">
                  <button
                    onClick={() => handleSort("ispremium")}
                    className="flex items-center gap-3 font-bold text-cyan-300 hover:text-cyan-200 transition-colors text-sm uppercase tracking-wider"
                  >
                    <Zap className="w-4 h-4" />
                    Premium
                    {sortField.toString() === "ispremium" && (
                      <span className="text-cyan-400">
                        {sortDirection === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </span>
                    )}
                  </button>
                </th>
                <th className="px-6 py-5 text-left">
                  <span className="font-bold text-cyan-300 text-sm uppercase tracking-wider">
                    Status
                  </span>
                </th>
                <th className="px-6 py-5 text-left">
                  <button
                    onClick={() => handleSort("date")}
                    className="flex items-center gap-3 font-bold text-cyan-300 hover:text-cyan-200 transition-colors text-sm uppercase tracking-wider"
                  >
                    Time
                    {sortField.toString() === "date" && (
                      <span className="text-cyan-400">
                        {sortDirection === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </span>
                    )}
                  </button>
                </th>
                <th className="px-6 py-5 text-center">
                  <span className="font-bold text-cyan-300 text-sm uppercase tracking-wider">
                    Actions
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-500/20">
              {filteredAndSortedRequests.map((request) => (
                <tr
                  key={request.id}
                  className="hover:bg-gradient-to-r hover:from-cyan-900/20 hover:to-blue-900/20 transition-all duration-300 group border-b border-slate-800/50"
                >
                  <td className="px-6 py-6">
                    <div className="flex flex-col space-y-1">
                      <span className="font-bold text-white text-lg group-hover:text-cyan-300 transition-colors">
                        {request.trackname}
                      </span>
                      <span className="text-cyan-400/80 font-medium">
                        {request.artist}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="relative">
                      {request.ispremium ? (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full blur opacity-40"></div>
                          <span className="relative inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border border-yellow-500/50">
                            YES
                          </span>
                        </>
                      ) : (
                        <span className="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-bold bg-gray-500/20 text-gray-400 border border-gray-500/50">
                          NO
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="relative">
                      <div
                        className={`absolute inset-0 rounded-full blur shadow-lg ${
                          getStatusColor(request.status).includes("shadow-")
                            ? getStatusColor(request.status)
                                .split(" ")
                                .find((c) => c.includes("shadow-"))
                            : ""
                        }`}
                      ></div>
                      <span
                        className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border ${getStatusColor(
                          request.status
                        )} backdrop-blur-sm`}
                      >
                        {getStatusIcon(request.status)}
                        {request.status.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-slate-400 font-mono text-sm">
                      {formatTime(request.date)}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center justify-center gap-2">
                      {request.status === "pending" && (
                        <button
                          onClick={() =>
                            handleStatusChange(request.id, "playing")
                          }
                          className="relative p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-all duration-200 group/btn"
                          title="Mark as Playing"
                        >
                          <div className="absolute inset-0 bg-blue-500 rounded-lg blur opacity-0 group-hover/btn:opacity-30 transition-opacity"></div>
                          <Play className="relative w-5 h-5" />
                        </button>
                      )}
                      {request.status !== "played" && (
                        <button
                          onClick={() =>
                            handleStatusChange(request.id, "played")
                          }
                          className="relative p-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20 rounded-lg transition-all duration-200 group/btn"
                          title="Mark as Played"
                        >
                          <div className="absolute inset-0 bg-cyan-500 rounded-lg blur opacity-0 group-hover/btn:opacity-30 transition-opacity"></div>
                          <CircleStop className="relative w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleArchive(request.id)}
                        className="relative p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200 group/btn"
                        title="Archive"
                      >
                        <div className="absolute inset-0 bg-red-500 rounded-lg blur opacity-0 group-hover/btn:opacity-30 transition-opacity"></div>
                        <ArchiveX className="relative w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredAndSortedRequests.length === 0 && (
          <div className="relative p-16 text-center">
            <div className="text-cyan-400/60 mb-6">
              <Music className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-cyan-300 mb-4">
              No beats found
            </h3>
            <p className="text-slate-400 text-lg">
              Adjust your search to find the perfect track.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="relative px-8 py-6 border-t border-cyan-500/30 bg-gradient-to-r from-slate-900/60 to-blue-900/60">
          <div className="flex justify-between items-center">
            <span className="text-cyan-300 font-medium">
              Showing {filteredAndSortedRequests.length} of {requests.length}{" "}
              requests
            </span>
            <div className="flex gap-3">
              <button className="relative px-4 py-2 bg-black/40 border border-cyan-500/50 text-cyan-300 rounded-lg hover:bg-cyan-500/20 hover:border-cyan-400 transition-all duration-200 font-medium group">
                <div className="absolute inset-0 bg-cyan-500 rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity"></div>
                <span className="relative">Previous</span>
              </button>
              <button className="relative px-4 py-2 bg-black/40 border border-cyan-500/50 text-cyan-300 rounded-lg hover:bg-cyan-500/20 hover:border-cyan-400 transition-all duration-200 font-medium group">
                <div className="absolute inset-0 bg-cyan-500 rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity"></div>
                <span className="relative">Next</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongRequestTable;
