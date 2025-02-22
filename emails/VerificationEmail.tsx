import * as React from "react";
import { Html, Head, Preview, Body, Container, Section, Text, Button } from "@react-email/components";

interface OTPEmailProps {
  otp: string;
    username: string;
}

export const VerificationEmail = ({ otp,   username }: OTPEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your OTP for Secure Login</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Text style={styles.title}>Secure Login OTP</Text>
          </Section>

          <Section style={styles.content}>
            <Text style={styles.greeting}>Hello {  username},</Text>
            <Text style={styles.message}>
              You requested a One-Time Password (OTP) to log in. Use the OTP below to proceed:
            </Text>

            <Text style={styles.otp}>{otp}</Text>

            <Button style={styles.button} href="https://anon-mess.vercel.app/verify">
              Verify Now
            </Button>

            <Text style={styles.footer}>
              If you didn't request this, please ignore this email. Your security is our priority.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default VerificationEmail;

const styles = {
  body: {
    backgroundColor: "#f4f4f4",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
  },
  container: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center" as const,
    maxWidth: "480px",
    margin: "auto",
  },
  header: {
    backgroundColor: "#4A90E2",
    padding: "10px",
    borderRadius: "10px 10px 0 0",
  },
  title: {
    fontSize: "24px",
    color: "#ffffff",
    fontWeight: "bold" as const,
  },
  content: {
    padding: "20px",
  },
  greeting: {
    fontSize: "18px",
    fontWeight: "bold" as const,
    color: "#333",
  },
  message: {
    fontSize: "16px",
    color: "#555",
    marginBottom: "20px",
  },
  otp: {
    fontSize: "28px",
    fontWeight: "bold" as const,
    backgroundColor: "#f3f3f3",
    display: "inline-block",
    padding: "10px 20px",
    borderRadius: "5px",
    color: "#333",
    marginBottom: "20px",
  },
  button: {
    backgroundColor: "#4A90E2",
    color: "#ffffff",
    padding: "12px 25px",
    fontSize: "16px",
    fontWeight: "bold" as const,
    textDecoration: "none",
    borderRadius: "5px",
    display: "inline-block",
  },
  footer: {
    fontSize: "14px",
    color: "#777",
    marginTop: "20px",
  },
};