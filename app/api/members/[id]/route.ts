import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const client = await clientPromise;
    const db = client.db("dw-team-manager");
    const member = await db
      .collection("members")
      .findOne({ _id: new ObjectId(id as string) });

    if (!member) {
      return NextResponse.json(
        { success: false, error: "Member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: member });
  } catch (error) {
    console.error("Error fetching member:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch member" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const client = await clientPromise;
    const db = client.db("dw-team-manager");
    const body = await request.json();

    const { location, name, rank, level, kills, cp } = body;

    let updateOperator: Record<string, unknown> = { $set: {} };

    // Handle location update or removal
    if (location !== undefined) {
      if (location === null) {
        updateOperator = { $unset: { location: "" } };
      } else {
        (updateOperator.$set as Record<string, unknown>).location = location;
      }
    }

    // Handle regular field updates
    if (name !== undefined) {
      (updateOperator.$set as Record<string, unknown>).name = name;
    }
    if (rank !== undefined) {
      (updateOperator.$set as Record<string, unknown>).rank = rank;
    }
    if (level !== undefined) {
      (updateOperator.$set as Record<string, unknown>).level = level;
    }
    if (kills !== undefined) {
      (updateOperator.$set as Record<string, unknown>).kills = Number(kills);
    }
    if (cp !== undefined) {
      (updateOperator.$set as Record<string, unknown>).cp = Number(cp);
    }

    const result = await db
      .collection("members")
      .updateOne({ _id: new ObjectId(id as string) }, updateOperator);

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error updating member:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update member" },
      { status: 500 }
    );
  }
}
