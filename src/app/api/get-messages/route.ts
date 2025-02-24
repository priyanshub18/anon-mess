import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import authOptions from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/user";
import { User } from "next-auth";

export async function GET(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "You are not logged in",
      },
      {
        status: 401,
      }
    );
  }
  //   const userId = user._id;
  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const user = await UserModel.aggregate([{ $match: { _id: userId } }, { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } }, { $sort: { "messages.createdAt": -1 } }, { $group: { _id: "$_id", messages: { $push: "$messages" } } }]);
    console.log(user);
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 400,
        }
      );
    }
    if (user.length === 0) {
      return Response.json(
        {
          success: true,
          messages: "No Messages found",
        },
        {
          status: 400,
        }
      );
    }
    return Response.json(
      {
        success: true,
        // message: "Messages fetched successfully",
        messages: user[0].messages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
