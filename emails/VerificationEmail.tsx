import * as React from "react";
import { Html, Head, Preview, Body, Container, Section, Text, Button } from "@react-email/components";

interface OTPEmailProps {
  otp: string;
  username: string;
}

export const VerificationEmail = ({ otp, username }: OTPEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your One-Time Password (OTP) for Secure Login</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Text style={styles.title}>Secure Access</Text>
          </Section>

          <Section style={styles.content}>
            <Text style={styles.logo}>🔐</Text>

            <Text style={styles.greeting}>Hello, {username}</Text>

            <Text style={styles.message}>You've requested a One-Time Password (OTP) to access your account. For your security, please use the code below within the next 15 minutes.</Text>

            <Section style={styles.otpContainer}>
              <Text style={styles.otp}>{otp}</Text>
            </Section>

            <Button href='https://anon-mess.vercel.app/verify' style={styles.button}>
              Verify Account
            </Button>

            <Text style={styles.cautionText}>If you didn't initiate this request, please contact our support team immediately.</Text>

            <Section style={styles.footer}>
              <Text style={styles.footerText}>© 2024 Your Company. All rights reserved.</Text>
              <Text style={styles.footerSubtext}>Protecting your digital identity</Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default VerificationEmail;

const styles = {
  body: {
    backgroundColor: "#f0f2f5",
    fontFamily: "'Inter', Arial, sans-serif",
    padding: "20px",
    margin: 0,
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.08)",
    maxWidth: "480px",
    margin: "auto",
    border: "1px solid #e4e7eb",
  },
  header: {
    backgroundColor: "#4a5fff",
    padding: "15px",
    borderRadius: "12px 12px 0 0",
    textAlign: "center" as const,
  },
  title: {
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "bold" as const,
    margin: 0,
  },
  content: {
    padding: "30px",
    textAlign: "center" as const,
  },
  logo: {
    fontSize: "48px",
    marginBottom: "20px",
  },
  greeting: {
    fontSize: "22px",
    fontWeight: "600" as const,
    color: "#1a1a2c",
    marginBottom: "15px",
  },
  message: {
    fontSize: "16px",
    color: "#4a4a68",
    lineHeight: "1.6",
    marginBottom: "25px",
  },
  otpContainer: {
    backgroundColor: "#f0f3ff",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "25px",
  },
  otp: {
    fontSize: "32px",
    fontWeight: "bold" as const,
    letterSpacing: "8px",
    color: "#4a5fff",
    margin: 0,
  },
  button: {
    backgroundColor: "#4a5fff",
    color: "#ffffff",
    padding: "12px 25px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "600" as const,
    display: "inline-block",
    marginBottom: "25px",
  },
  cautionText: {
    fontSize: "14px",
    color: "#8f90a6",
    marginBottom: "25px",
  },
  footer: {
    borderTop: "1px solid #e4e7eb",
    paddingTop: "20px",
  },
  footerText: {
    fontSize: "12px",
    color: "#8f90a6",
    margin: "5px 0",
  },
  footerSubtext: {
    fontSize: "10px",
    color: "#b0b2c0",
    margin: "5px 0",
  },
};
