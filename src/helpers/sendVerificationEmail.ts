import { resend } from "@/lib/resend";

import EmailTemplate from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";



export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string,
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Anon-Mess Verification Code",
      react: EmailTemplate({ username: username, otp: verifyCode }),
    });
    return {
      success: true,
      message: "Verification email sent",
    };
  } catch (emailError) {
    console.log(emailError);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
