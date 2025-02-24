import { UserModel } from "@/model/user";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/user";
import { MessageModel } from "@/model/user";

export async function POST(req: Request) {
  await dbConnect();

  const { username, content } = await req.json();
  console.log(username, content);
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }
    //is user already accepting messages
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        {
          status: 403,
        }
      );
    }

    const newMessage = new MessageModel({
      content,
      createdAt: new Date(),
    });
    await newMessage.save();
    user.messages.push(newMessage);
    await user.save();
    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
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
        message: "Error adding messages",
      },
      {
        status: 500,
      }
    );
  }
}
