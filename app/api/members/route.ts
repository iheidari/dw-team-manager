import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("dw-team-manager");
    const members = await db.collection("members").find({}).toArray();

    // Collect all unique supervisor IDs
    const supervisorIds = [
      ...new Set(
        members
          .filter((m) => m.supervisedBy)
          .map((m) => m.supervisedBy)
          .filter(Boolean)
      ),
    ].map((id) => (typeof id === "string" ? new ObjectId(id) : id));

    // Batch fetch all supervisors
    const supervisors =
      supervisorIds.length > 0
        ? await db
            .collection("members")
            .find({ _id: { $in: supervisorIds } })
            .toArray()
        : [];

    // Create a map for quick lookup
    const supervisorMap = new Map(
      supervisors.map((s) => [s._id.toString(), s.name])
    );

    // Populate supervisor names for members with supervisedBy field
    const membersWithSupervisor = members.map((member) => {
      if (member.supervisedBy) {
        const supervisorId =
          typeof member.supervisedBy === "string"
            ? member.supervisedBy
            : member.supervisedBy.toString();
        return {
          ...member,
          supervisedByName: supervisorMap.get(supervisorId) || null,
        };
      }
      return {
        ...member,
        supervisedByName: null,
      };
    });

    return NextResponse.json({ success: true, data: membersWithSupervisor });
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("dw-team-manager");
    const body = await request.json();

    // Validate required fields
    const { name, rank, level, kills, cp } = body;
    if (!name || !rank || !level) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await db.collection("members").insertOne({
      name,
      rank,
      level,
      kills: kills ? Number(kills) : 0,
      cp: cp ? Number(cp) : 0,
    });

    return NextResponse.json(
      { success: true, data: { _id: result.insertedId } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating member:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create member" },
      { status: 500 }
    );
  }
}
