import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/user";
import z from "zod";
import { verifySchema } from "@/schemas/verifySchema";
import { usernameValidation } from "@/schemas/signUpSchema";
import { tree } from "next/dist/build/templates/app-page";
const usernameQuerySchema = z.object({
  username: usernameValidation,
  otp: verifySchema,
});
export async function POST(req: Request) {
  await dbConnect();

  try {
    const { username, otp } = await req.json();
    const decodeUsername = decodeURIComponent(username);
    const existingUserByUsername = await UserModel.findOne({
      username: decodeUsername,
    });
    if (!existingUserByUsername) {
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
    if (existingUserByUsername.isVerified) {
      return Response.json(
        {
          success: true,
          message: "User already verified",
        },
        {
          status: 400,
        }
      );
    }
    const isCodeValid = existingUserByUsername.verifyCode === otp;
    const isCodeNotExpired = new Date() < new Date(existingUserByUsername.verifyCodeExpiry);
    if (isCodeValid && isCodeNotExpired) {
      existingUserByUsername.isVerified = true;
      await existingUserByUsername.save();
      return Response.json(
        {
          success: true,
          message: "OTP verified successfully",
        },
        {
          status: 200,
        }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "OTP has expired Please sign-up again",
        },
        {
          status: 400,
        }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Invalid OTP",
        },
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    console.log("Error verifying code", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying code",
      },
      {
        status: 500,
      }
    );
  }
}
