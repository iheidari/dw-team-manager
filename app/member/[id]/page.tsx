"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/ui/Header";
import BackButton from "@/app/ui/BackButton";
import Field from "./components/Field";
import SelectField from "./components/SelectField";
import TextAreaField from "./components/TextAreaField";
import ReadOnlyField from "./components/ReadOnlyField";
import NotFound from "./components/NotFound";
import { LEVEL_OPTIONS, RANK_OPTIONS } from "../util";
import Link from "next/link";

interface Member {
  _id: string;
  name: string;
  rank: string;
  level: string;
  kills: number;
  cp: number;
  notes?: string;
  location?: {
    row: number;
    col: number;
  };
  supervisedByName?: string | null;
}

export default function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    rank: "",
    level: "",
    kills: "",
    cp: "",
    notes: "",
  });
  const router = useRouter();

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const resolvedParams = await params;
        const response = await fetch(`/api/members/${resolvedParams.id}`);
        if (!response.ok) {
          setMember(null);
          return;
        }
        const result = await response.json();
        const memberData = result.data;
        setMember(memberData);
        setFormData({
          name: memberData.name,
          rank: memberData.rank,
          level: memberData.level,
          kills: memberData.kills,
          cp: memberData.cp,
          notes: memberData.notes || "",
        });
      } catch (error) {
        console.error("Error fetching member:", error);
        setMember(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [params]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/members/${member._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          rank: formData.rank,
          level: formData.level,
          kills: Number(formData.kills),
          cp: Number(formData.cp),
          notes: formData.notes || "",
        }),
      });

      if (response.ok) {
        // Refresh the data
        router.push("/");
      } else {
        alert("Failed to update member");
      }
    } catch (error) {
      console.error("Error updating member:", error);
      alert("Error updating member");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!member) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/members/${member._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Redirect to home
        router.replace("/");
      } else {
        alert("Failed to delete member");
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      alert("Error deleting member");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <div className="flex min-h-screen w-full max-w-5xl flex-col items-center py-16 px-8 bg-white dark:bg-black sm:items-start">
          <Header />
          <div className="w-full flex items-center justify-center">
            <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!member) {
    return <NotFound />;
  }

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
                  Edit Member
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
                    label="Watch Tower"
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

                  <ReadOnlyField
                    label="Supervisor"
                    name="supervisor"
                    value={member.supervisedByName || null}
                    hint={
                      <span>
                        For changing supervisor, visit{" "}
                        <Link
                          href="/supervisors"
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
                        >
                          supervisor page
                        </Link>
                      </span>
                    }
                  />
                </div>
              </div>

              <div className="mt-6">
                <TextAreaField
                  label="Notes"
                  name="notes"
                  value={formData.notes}
                  onChange={(value) => handleChange("notes", value)}
                  rows={5}
                />
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  disabled={submitting || deleting}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Delete
                </button>

                <button
                  type="submit"
                  disabled={submitting || deleting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
                Confirm Delete
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                Are you sure you want to delete this member? This action cannot
                be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancelDelete}
                  disabled={deleting}
                  className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-white rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
