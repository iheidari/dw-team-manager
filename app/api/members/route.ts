import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("dw-team-manager");
    const members = await db.collection("members").find({}).toArray();

    return NextResponse.json({ success: true, data: members });
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
