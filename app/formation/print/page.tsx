"use client";

import { useEffect, useState } from "react";
import { Member } from "../../services/types";
import Loading from "../../ui/Loading";
import BackButton from "../../ui/BackButton";

export default function FormationPrint() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/members")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const membersData = data.data as Member[];
          setMembers(membersData);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching members:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loading message="Loading formation..." />;
  }

  // Calculate grid dimensions
  const positionedMembers = members.filter((m) => m.location);
  const maxRow = Math.max(...positionedMembers.map((m) => m.location!.row), 0);
  const maxCol = Math.max(...positionedMembers.map((m) => m.location!.col), 0);

  // Create a map of position to member
  const positionMap = new Map<string, Member>();
  positionedMembers.forEach((member) => {
    if (member.location) {
      const key = `${member.location.row}-${member.location.col}`;
      positionMap.set(key, member);
    }
  });

  // Helper function to get member at a position
  const getMemberAtPosition = (
    row: number,
    col: number
  ): Member | undefined => {
    const key = `${row}-${col}`;
    return positionMap.get(key);
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          body {
            font-size: 12px;
          }
          h1 {
            font-size: 18px !important;
            margin-bottom: 12px !important;
          }
          table {
            font-size: 10px !important;
          }
          th, td {
            padding: 4px 6px !important;
            font-size: 10px !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `,
        }}
      />
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex min-h-screen w-full  flex-col items-center py-16 px-8 bg-white dark:bg-black sm:items-start">
          <div className="flex w-full justify-between items-center mb-8 no-print">
            <BackButton />
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Print
            </button>
          </div>

          <div className="w-full">
            <h1 className="text-3xl font-bold mb-6 text-zinc-900 dark:text-white print:text-lg print:mb-3">
              Formation View
            </h1>

            {positionedMembers.length === 0 ? (
              <p className="text-zinc-600 dark:text-zinc-400">
                No members are positioned in the formation.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="border-collapse border border-zinc-300 dark:border-zinc-700 print:text-xs">
                  <thead>
                    <tr className="bg-zinc-100 dark:bg-zinc-800">
                      <th className="border border-zinc-300 dark:border-zinc-700 px-4 py-3 text-center font-semibold text-zinc-900 dark:text-white print:px-2 print:py-1 print:text-xs"></th>
                      {Array.from({ length: maxCol + 1 }, (_, i) => (
                        <th
                          key={i}
                          className="border border-zinc-300 dark:border-zinc-700 px-4 py-3 text-center font-semibold text-zinc-900 dark:text-white print:px-2 print:py-1 print:text-xs"
                        >
                          {i}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: maxRow + 1 }, (_, rowIndex) => (
                      <tr key={rowIndex}>
                        <td className="border border-zinc-300 dark:border-zinc-700 px-4 py-3 text-center font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white print:px-2 print:py-1 print:text-xs">
                          {rowIndex}
                        </td>
                        {Array.from({ length: maxCol + 1 }, (_, colIndex) => {
                          const member = getMemberAtPosition(
                            rowIndex,
                            colIndex
                          );
                          return (
                            <td
                              key={colIndex}
                              className="border border-zinc-300 dark:border-zinc-700 px-4 py-3 text-center text-zinc-900 dark:text-white min-w-[120px] print:px-2 print:py-1 print:text-xs print:min-w-0"
                            >
                              {member ? member.name : "—"}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
