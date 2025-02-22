import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/user";
import z from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(req: Request) {
  if(req.method !== "GET"){
    return Response.json(
      {
        success: false,
        message: "Method not allowed",
      },
      {
        status: 405,
      }
    );
  }
    await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const queryParams = { username: searchParams.get("username") };

    const res = usernameQuerySchema.safeParse(queryParams);
    if (!res.success) {
      const usernameErrors = res.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message: usernameErrors.length > 0 ? usernameErrors.join(",") : "Invalid username",
        },
        {
          status: 400,
        }
      );
    }
    const { username } = res.data;
    const existingVerifiedUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiedUserByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username already exists",
        },
        {
          status: 400,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Username is unique",
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
        message: "Error checking username unique",
      },
      {
        status: 500,
      }
    );
  }
}
