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

    const { location } = body;

    let updateOperator: Record<string, unknown> = {};

    if (location !== undefined) {
      if (location === null) {
        // Use $unset to remove the location field
        updateOperator = { $unset: { location: "" } };
      } else {
        // Use $set to update the location field
        updateOperator = { $set: { location } };
      }
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
