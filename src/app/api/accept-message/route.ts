import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import authOptions from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/user";
import { User } from "next-auth";
import { get } from "http";

export async function POST(req: Request) {
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

  const userId = user._id;
  const { acceptMessages } = await req.json();
  try {
    const UpdatedUser = await UserModel.findByIdAndUpdate(userId, { isAcceptingMessage: acceptMessages }, { new: true });
    if (!UpdatedUser) {
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
    return Response.json(
      {
        success: true,
        message: "Message acceptance status updated successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error updating message acceptance status", error);
    return Response.json(
      {
        success: false,
        message: "Error updating message acceptance status",
      },
      {
        status: 500,
      }
    );
  }
}

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

  const userId = user._id;
  try {
    const user = await UserModel.findById(userId);
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
    return Response.json(
      {
        success: true,
        message: "Message acceptance status fetched successfully",
        isAcceptingMessage: user.isAcceptingMessage,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error fetching message acceptance status", error);
    return Response.json(
      {
        success: false,
        message: "Error fetching message acceptance status",
      },
      {
        status: 500,
      }
    );
  }
}
