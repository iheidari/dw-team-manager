"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import BackButton from "./[id]/components/BackButton";
import Field from "./[id]/components/Field";
import SelectField from "./[id]/components/SelectField";
import { LEVEL_OPTIONS, RANK_OPTIONS } from "./util";

export default function NewMemberPage() {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    rank: "R1",
    level: "Ind1",
    kills: "",
    cp: "",
  });
  const router = useRouter();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.rank || !formData.level) {
      alert("Please fill in all required fields (Name, Rank, Level)");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          rank: formData.rank,
          level: formData.level,
          kills: Number(formData.kills) || 0,
          cp: Number(formData.cp) || 0,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Redirect to the new member detail page
        router.push(`/member/${result.data._id}`);
      } else {
        alert(result.error || "Failed to create member");
      }
    } catch (error) {
      console.error("Error creating member:", error);
      alert("Error creating member");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex min-h-screen w-full max-w-5xl flex-col items-center py-16 px-8 bg-white dark:bg-black sm:items-start">
        <Header />

        <div className="w-full">
          <BackButton />

          <form onSubmit={handleSubmit}>
            <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
                  Add New Member
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Field
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={(value) => handleChange("name", value)}
                  />

                  <SelectField
                    label="Rank"
                    name="rank"
                    value={formData.rank}
                    onChange={(value) => handleChange("rank", value)}
                    options={RANK_OPTIONS}
                  />

                  <SelectField
                    label="Level"
                    name="level"
                    value={formData.level}
                    onChange={(value) => handleChange("level", value)}
                    options={LEVEL_OPTIONS}
                  />
                </div>

                <div className="space-y-4">
                  <Field
                    label="Kills"
                    name="kills"
                    value={formData.kills}
                    onChange={(value) => handleChange("kills", value)}
                  />

                  <Field
                    label="CP"
                    name="cp"
                    value={formData.cp}
                    onChange={(value) => handleChange("cp", value)}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? "Creating..." : "Create Member"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
