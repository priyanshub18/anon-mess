import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Font,
  Heading,
} from "@react-email/components";

interface EmailTemplateProps {
  username: string;
  otp: string;
}

const EmailTemplate = ({
  username,
  otp,
}: {
  username: string;
  otp: string;
}) => {
  return (
    <Html>
      <Head>
        <title>Anon-Mess Verification Code</title>
        {/* @ts-ignore */}
        <Font fontFamily="Roboto" fontWeight={400} fontStyle="normal" />
      </Head>
      <Body
        style={{
          backgroundColor: "#f4f4f4",
          padding: "20px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "10px",
            maxWidth: "600px",
            margin: "auto",
          }}
        >
          <Heading style={{ color: "#333" }}>Your OTP Code</Heading>
          <Text>Hi {username},</Text>
          <Text>Your One-Time Password (OTP) for verification is:</Text>
          <Text
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {otp}
          </Text>
          <Text>
            This OTP is valid for a limited time. Do not share it with anyone.
          </Text>
          <Text>Best Regards,</Text>
          <Text>Anon-Mess Team</Text>
        </Container>
      </Body>
    </Html>
  );
};

export default EmailTemplate;
