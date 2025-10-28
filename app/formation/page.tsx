"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import { Member } from "../services/types";
import Loading from "./components/Loading";
import Card from "./components/Card";

export default function Formation() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [gridConfig, setGridConfig] = useState({ rows: 1, cols: 1 });

  useEffect(() => {
    fetch("/api/members")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const membersData = data.data as Member[];
          setMembers(membersData);

          // Calculate grid dimensions based on member locations
          const maxRow = Math.max(
            ...membersData
              .filter((m) => m.location)
              .map((m) => m.location!.row),
            0
          );
          const maxCol = Math.max(
            ...membersData
              .filter((m) => m.location)
              .map((m) => m.location!.col),
            0
          );

          setGridConfig({
            rows: maxRow + 1,
            cols: maxCol + 1,
          });
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching members:", error);
        setLoading(false);
      });
  }, []);

  const getMemberAtPosition = (
    row: number,
    col: number
  ): Member | undefined => {
    return members.find(
      (member) => member.location?.row === row && member.location?.col === col
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-7xl flex-col items-center py-16 px-8 bg-white dark:bg-black sm:items-start">
        <Header />
        <div className="w-full mt-8">
          <h2 className="text-2xl font-semibold mb-6 text-zinc-900 dark:text-white">
            Formation
          </h2>

          <div
            className="grid gap-4 mb-4"
            style={{
              gridTemplateColumns: `repeat(${gridConfig.cols}, minmax(120px, 1fr))`,
            }}
          >
            {Array.from({ length: gridConfig.rows * gridConfig.cols }).map(
              (_, index) => {
                const row = Math.floor(index / gridConfig.cols);
                const col = index % gridConfig.cols;
                const member = getMemberAtPosition(row, col);

                return <Card key={index} member={member} />;
              }
            )}
          </div>

          {members.filter((m) => !m.location).length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">
                Members without position
              </h3>
              <div className="flex flex-wrap gap-2">
                {members
                  .filter((m) => !m.location)
                  .map((member) => (
                    <Card key={member._id} member={member} />
                  ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
