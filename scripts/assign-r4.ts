import "dotenv/config";
import clientPromise from "../lib/mongodb";
import { Member } from "../app/services/types";
import { ObjectId } from "mongodb";

interface R4Assignment {
  r4Member: Member;
  assignees: Member[];
  totalCP: number;
}

/**
 * Connects to MongoDB and retrieves all members with a specific rank
 * @param rank - The rank to filter by (R1, R2, R3, or R4)
 * @returns Promise<Member[]> - Array of members with the specified rank
 */
async function getMembersByRank(rank: string): Promise<Member[]> {
  try {
    const client = await clientPromise;
    const db = client.db("dw-team-manager");

    const members = await db
      .collection("members")
      .find({ rank: rank })
      .toArray();

    return members.map((member) => ({
      _id: member._id.toString(),
      name: member.name,
      rank: member.rank,
      level: member.level,
      kills: member.kills || 0,
      cp: member.cp || 0,
      location: member.location || undefined,
    }));
  } catch (error) {
    console.error(`Error fetching ${rank} members:`, error);
    throw new Error(`Failed to fetch ${rank} members from database`);
  }
}

/**
 * Distributes assignees (R1, R2, R3) to R4 members
 * Priority: 1) Equal count of assignees, 2) Balanced total CP
 */
function distributeAssignees(
  r4Members: Member[],
  assignees: Member[]
): R4Assignment[] {
  if (r4Members.length === 0) {
    return [];
  }

  // Initialize assignments
  const assignments: R4Assignment[] = r4Members.map((r4) => ({
    r4Member: r4,
    assignees: [],
    totalCP: 0,
  }));

  // Sort assignees by CP (descending) for better distribution
  const sortedAssignees = [...assignees].sort((a, b) => b.cp - a.cp);

  // Distribute each assignee
  for (const assignee of sortedAssignees) {
    // Find the R4 with:
    // 1. Lowest count of assignees (primary criteria)
    // 2. If tied, lowest total CP (secondary criteria)
    let bestIndex = 0;
    let minCount = assignments[0].assignees.length;
    let minCP = assignments[0].totalCP;

    for (let i = 1; i < assignments.length; i++) {
      const assignment = assignments[i];
      if (
        assignment.assignees.length < minCount ||
        (assignment.assignees.length === minCount && assignment.totalCP < minCP)
      ) {
        bestIndex = i;
        minCount = assignment.assignees.length;
        minCP = assignment.totalCP;
      }
    }

    // Assign to the best R4
    assignments[bestIndex].assignees.push(assignee);
    assignments[bestIndex].totalCP += assignee.cp;
  }

  return assignments;
}

/**
 * Saves the distribution results to MongoDB
 * - Updates assignees (R1, R2, R3) with "supervisedBy" field pointing to their R4 supervisor
 * - Updates R4 members with "assignees" array containing assignee IDs
 */
async function saveAssignmentsToDatabase(
  assignments: R4Assignment[]
): Promise<void> {
  try {
    const client = await clientPromise;
    const db = client.db("dw-team-manager");
    const membersCollection = db.collection("members");

    console.log("\nSaving assignments to database...");

    // First, clear all previous assignments (set supervisedBy to null for R1, R2, R3)
    const clearResult = await membersCollection.updateMany(
      { rank: { $in: ["R1", "R2", "R3"] } },
      { $unset: { supervisedBy: "" } }
    );
    console.log(
      `Cleared previous assignments from ${clearResult.modifiedCount} members`
    );

    // Clear assignees arrays from R4 members
    const clearR4Result = await membersCollection.updateMany(
      { rank: "R4" },
      { $unset: { assignees: "" } }
    );
    console.log(
      `Cleared assignees list from ${clearR4Result.modifiedCount} R4 members`
    );

    // Update each assignment
    let totalUpdated = 0;

    for (const assignment of assignments) {
      const r4Id = new ObjectId(assignment.r4Member._id);
      const assigneeIds = assignment.assignees.map((a) => new ObjectId(a._id));

      // Update assignees with their supervisor (R4)
      if (assigneeIds.length > 0) {
        const assigneeUpdateResult = await membersCollection.updateMany(
          { _id: { $in: assigneeIds } },
          { $set: { supervisedBy: r4Id } }
        );
        totalUpdated += assigneeUpdateResult.modifiedCount;
      }
    }

    console.log(
      `✓ Updated ${totalUpdated} assignees with supervisor information`
    );
    console.log("Database updates completed successfully!\n");
  } catch (error) {
    console.error("Error saving assignments to database:", error);
    throw error;
  }
}

/**
 * Displays the distribution results
 */
function displayDistribution(assignments: R4Assignment[]): void {
  console.log("\n" + "=".repeat(80));
  console.log("ASSIGNMENT DISTRIBUTION RESULTS");
  console.log("=".repeat(80) + "\n");

  if (assignments.length === 0) {
    console.log("No R4 members found. Nothing to distribute.");
    return;
  }

  // Calculate statistics
  const totalAssignees = assignments.reduce(
    (sum, a) => sum + a.assignees.length,
    0
  );
  const avgAssignees = totalAssignees / assignments.length;
  const totalCP = assignments.reduce((sum, a) => sum + a.totalCP, 0);
  const avgCP = totalCP / assignments.length;

  console.log("SUMMARY:");
  console.log(`- Total R4 members: ${assignments.length}`);
  console.log(`- Total assignees (R1, R2, R3): ${totalAssignees}`);
  console.log(`- Average assignees per R4: ${avgAssignees.toFixed(2)}`);
  console.log(`- Average total CP per R4: ${avgCP.toLocaleString()}`);
  console.log("\n" + "-".repeat(80) + "\n");

  // Display each R4 with their assignees
  assignments.forEach((assignment, index) => {
    console.log(`${index + 1}. R4: ${assignment.r4Member.name}`);
    console.log(`   Total Assignees: ${assignment.assignees.length}`);
    console.log(
      `   Total CP of Assignees: ${assignment.totalCP.toLocaleString()}`
    );
    console.log(`   Assignees:`);

    if (assignment.assignees.length === 0) {
      console.log(`     (None)`);
    } else {
      // Group by rank for better readability
      const byRank: Record<string, Member[]> = {};
      assignment.assignees.forEach((member) => {
        if (!byRank[member.rank]) {
          byRank[member.rank] = [];
        }
        byRank[member.rank].push(member);
      });

      Object.keys(byRank)
        .sort()
        .forEach((rank) => {
          byRank[rank].forEach((member) => {
            console.log(
              `     - ${
                member.name
              } (${rank}, CP: ${member.cp.toLocaleString()})`
            );
          });
        });
    }
    console.log(""); // Empty line between R4s
  });

  // Display balance statistics
  console.log("-".repeat(80));
  console.log("BALANCE STATISTICS:");
  const assigneeCounts = assignments.map((a) => a.assignees.length);
  const minCount = Math.min(...assigneeCounts);
  const maxCount = Math.max(...assigneeCounts);
  const countDiff = maxCount - minCount;

  const cpValues = assignments.map((a) => a.totalCP);
  const minCP = Math.min(...cpValues);
  const maxCP = Math.max(...cpValues);
  const cpDiff = maxCP - minCP;
  const cpDiffPercent = avgCP > 0 ? ((cpDiff / avgCP) * 100).toFixed(2) : "0";

  console.log(
    `- Assignee count range: ${minCount} - ${maxCount} (difference: ${countDiff})`
  );
  console.log(
    `- Total CP range: ${minCP.toLocaleString()} - ${maxCP.toLocaleString()} (difference: ${cpDiff.toLocaleString()}, ${cpDiffPercent}%)`
  );
  console.log("=".repeat(80) + "\n");
}

/**
 * Main function to connect to MongoDB, fetch members, and distribute them
 */
async function main() {
  try {
    console.log("Connecting to MongoDB...");
    console.log("Fetching members...\n");

    // Get all R4 members
    const r4Members = await getMembersByRank("R4");
    console.log(`Found ${r4Members.length} R4 members`);

    if (r4Members.length === 0) {
      console.log("No R4 members found. Cannot perform distribution.");
      process.exit(1);
    }

    // Get all R1, R2, and R3 members
    const [r1Members, r2Members, r3Members] = await Promise.all([
      getMembersByRank("R1"),
      getMembersByRank("R2"),
      getMembersByRank("R3"),
    ]);

    // Combine all assignees
    const allAssignees = [...r1Members, ...r2Members, ...r3Members];

    console.log(`Found ${r1Members.length} R1 members`);
    console.log(`Found ${r2Members.length} R2 members`);
    console.log(`Found ${r3Members.length} R3 members`);
    console.log(`Total assignees: ${allAssignees.length}\n`);

    if (allAssignees.length === 0) {
      console.log("No assignees (R1, R2, R3) found. Nothing to distribute.");
      process.exit(0);
    }

    // Distribute assignees to R4 members
    console.log("Distributing assignees to R4 members...");
    const assignments = distributeAssignees(r4Members, allAssignees);

    // Display results
    displayDistribution(assignments);

    // Save assignments to MongoDB
    await saveAssignmentsToDatabase(assignments);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

// Run the main function
main();
