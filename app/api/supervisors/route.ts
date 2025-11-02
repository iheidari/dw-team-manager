import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Member } from "@/app/services/types";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("dw-team-manager");

    // Get all R4 members
    const r4Members = await db
      .collection("members")
      .find({ rank: "R4" })
      .toArray();

    // Get all members with supervisedBy field
    const supervisedMembers = await db
      .collection("members")
      .find({ supervisedBy: { $exists: true, $ne: null } })
      .toArray();

    // Group supervised members by supervisor ID
    const supervisorMap = new Map<string, Member[]>();

    supervisedMembers.forEach((member) => {
      const supervisorId =
        typeof member.supervisedBy === "string"
          ? member.supervisedBy
          : member.supervisedBy.toString();

      if (!supervisorMap.has(supervisorId)) {
        supervisorMap.set(supervisorId, []);
      }
      supervisorMap.get(supervisorId)!.push({
        _id: member._id.toString(),
        name: member.name,
        rank: member.rank,
        level: member.level,
        kills: member.kills || 0,
        cp: member.cp || 0,
      });
    });

    // Build result with R4 members and their assignees
    const result = r4Members.map((r4) => {
      const supervisorId = r4._id.toString();
      const assignees = supervisorMap.get(supervisorId) || [];

      return {
        _id: r4._id.toString(),
        name: r4.name,
        rank: r4.rank,
        level: r4.level,
        kills: r4.kills || 0,
        cp: r4.cp || 0,
        assignees: assignees,
        assigneesCount: assignees.length,
        assigneesTotalCP: assignees.reduce((sum, a) => sum + (a.cp || 0), 0),
      };
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching supervisors:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch supervisors" },
      { status: 500 }
    );
  }
}
