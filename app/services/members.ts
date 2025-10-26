import { Member } from "./types";

export async function getMember(id: string): Promise<Member | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${baseUrl}/api/members/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result.data as Member;
  } catch (error) {
    console.error("Error fetching member:", error);
    return null;
  }
}
