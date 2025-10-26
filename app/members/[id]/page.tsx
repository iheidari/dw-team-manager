import { Metadata } from "next";
import Header from "@/app/components/Header";
import { getMember } from "@/app/services/members";
import BackButton from "./components/BackButton";
import Field from "./components/Field";
import NotFound from "./components/NotFound";

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
    return <NotFound />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex min-h-screen w-full max-w-5xl flex-col items-center py-16 px-8 bg-white dark:bg-black sm:items-start">
        <Header />

        <div className="w-full">
          <BackButton />

          <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
                {member.name}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Field label="Name" value={member.name} />

                <Field label="Rank" value={member.rank} />

                <Field label="Level" value={member.level} />
              </div>

              <div className="space-y-4">
                <Field label="Kills" value={member.kills} />

                <Field label="CP" value={member.cp} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
