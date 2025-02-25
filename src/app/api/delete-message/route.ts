import { getServerSession } from "next-auth";
import { Types } from "mongoose";
import authOptions from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/user";
import { User } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { messageId } = await request.json();

  if (!messageId || !Types.ObjectId.isValid(messageId)) {
    return NextResponse.json({ success: false, message: "Invalid or missing Message ID" }, { status: 400 });
  }

  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ success: false, message: "Not Authenticated" }, { status: 401 });
  }

  const userId = new Types.ObjectId(session.user._id);
  const newMessageId = new Types.ObjectId(messageId);

  console.log("User ID:", userId);
  console.log("Message ID to delete:", messageId);
  console.log("Converted ObjectId:", newMessageId);

  try {
    const updatedResult = await UserModel.updateOne(
      { _id: userId },
      { $pull: { messages: { _id : newMessageId} } } // Adjust based on DB structure
    );

    if (updatedResult.modifiedCount === 0) {
      return NextResponse.json({ success: false, message: "Message not found or already deleted" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Successfully Deleted Message" }, { status: 200 });
  } catch (err) {
    console.error("Error deleting message:", err);
    return NextResponse.json({ success: false, message: "Error deleting message" }, { status: 500 });
  }
}
