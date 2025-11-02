"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/ui/Header";
import Link from "next/link";
import BackButton from "../ui/BackButton";

interface Assignee {
  _id: string;
  name: string;
  rank: string;
  level: string;
  kills: number;
  cp: number;
}

interface Supervisor {
  _id: string;
  name: string;
  rank: string;
  level: string;
  kills: number;
  cp: number;
  assignees: Assignee[];
  assigneesCount: number;
  assigneesTotalCP: number;
}

// Format CP in short version (1M for 1,000,000, 1K for 1,000, etc.)
function formatCPShort(cp: number): string {
  if (cp >= 1000000) {
    return `${(cp / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (cp >= 1000) {
    return `${(cp / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return cp.toString();
}

export default function SupervisorsPage() {
  const router = useRouter();
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/supervisors")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSupervisors(data.data);
        } else {
          setError(data.error || "Failed to load supervisors");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching supervisors:", error);
        setError("Error loading supervisors");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <div className="flex min-h-screen w-full max-w-5xl flex-col items-center py-16 px-8 bg-white dark:bg-black sm:items-start">
          <Header />
          <div className="w-full flex items-center justify-center h-64">
            <p className="text-zinc-600 dark:text-zinc-400">
              Loading supervisors...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <div className="flex min-h-screen w-full max-w-5xl flex-col items-center py-16 px-8 bg-white dark:bg-black sm:items-start">
          <Header />
          <div className="w-full">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex min-h-screen w-full max-w-5xl flex-col items-center py-16 px-8 bg-white dark:bg-black sm:items-start">
        <Header />

        <div className="w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
              Supervisors
            </h2>
            <BackButton />
          </div>

          {supervisors.length === 0 ? (
            <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 text-center">
              <p className="text-zinc-600 dark:text-zinc-400">
                No R4 supervisors found.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {supervisors.map((supervisor) => (
                <div key={supervisor._id}>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
                    {supervisor.name}
                  </h3>
                  {supervisor.assignees.length === 0 ? (
                    <p className="text-zinc-500 dark:text-zinc-400 italic">
                      No assignees
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {supervisor.assignees.map((assignee) => (
                        <Link
                          key={assignee._id}
                          href={`/member/${assignee._id}`}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
                        >
                          {assignee.name} ({formatCPShort(assignee.cp)})
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
