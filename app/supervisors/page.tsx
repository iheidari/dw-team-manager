"use client";

import { useState, useEffect } from "react";
import Header from "@/app/ui/Header";
import BackButton from "../ui/BackButton";
import Loading from "../ui/Loading";
import Error from "../ui/Error";
import NoData from "../ui/NoData";
import { Member } from "../services/types";
import SupervisorCard from "./components/SupervisorCard";

export interface Supervisor {
  _id: string;
  name: string;
  rank: string;
  level: string;
  kills: number;
  cp: number;
  assignees: Member[];
  assigneesCount: number;
  assigneesTotalCP: number;
}

export default function SupervisorsPage() {
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
    return <Loading message="Loading supervisors..." />;
  }

  if (error) {
    return <Error message={error} />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex min-h-screen w-full flex-col items-center py-16 px-8 bg-white dark:bg-black sm:items-start">
        <Header />

        <div className="w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
              Supervisors
            </h2>
            <BackButton />
          </div>

          {supervisors.length === 0 ? (
            <NoData message="No supervisors found" />
          ) : (
            <div className="flex flex-row flex-wrap gap-6 ">
              {supervisors.map((supervisor) => (
                <SupervisorCard key={supervisor._id} supervisor={supervisor} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
