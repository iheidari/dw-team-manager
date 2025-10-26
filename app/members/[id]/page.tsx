import { Metadata } from "next";
import Link from "next/link";
import Header from "@/app/components/Header";
import { getMember } from "@/app/services/members";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const member = await getMember(id);
  return {
    title: member ? `${member.name} - Team Member` : "Member Not Found",
  };
}

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = await getMember(id);

  if (!member) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <div className="flex min-h-screen w-full max-w-5xl flex-col items-center py-16 px-8 bg-white dark:bg-black sm:items-start">
          <Header />
          <div className="flex flex-col items-center justify-center w-full mt-16">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
              Member Not Found
            </h2>
            <Link
              href="/"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              ← Back to Team
            </Link>
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
          <Link
            href="/"
            className="inline-block mb-6 text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to Team
          </Link>

          <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
                {member.name}
              </h2>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                ID: {member._id}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Name
                  </label>
                  <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                    {member.name}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Rank
                  </label>
                  <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                    {member.rank}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Level
                  </label>
                  <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                    {member.level}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Kills
                  </label>
                  <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                    {member.kills}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    CP (Combat Points)
                  </label>
                  <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                    {member.cp}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
