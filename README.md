# Anon-Mess

## Overview
Anon-Mess is a MERN-based anonymous messaging application built using modern web technologies. The project enables users to send and receive messages anonymously, with AI-powered message suggestions and secure authentication. 

### **Project Details**
- **Start Date:** 21-Feb-2025
- **Expected End Date:** 02-Mar-2025
- **Tech Stack Used:**
  - **Frontend:** Next.js, Magic UI, Tailwind CSS
  - **Backend:** Node.js, Express, MongoDB, NextAuth
  - **Validation:** ZOD
  - **Authentication:** NextAuth with credential providers
  - **AI Integration:** OpenAI API, Gemini API for message suggestions
  - **Mailing Service:** Resend-Email API

## **Installation and Setup**
### **Prerequisites**
- Node.js (v18+ recommended)
- MongoDB (Atlas or Local instance)
- NPM or Yarn

### **Setting up the project**
1. Clone the repository:
   ```sh
   git clone https://github.com/priyanshub18/anon-mess.git
   cd anon-mess
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables (`.env.local`):
   ```env
   MONGODB_URI=your-mongodb-connection-string
   NEXTAUTH_SECRET=your-secret-key
   RESEND_API_KEY=your-resend-api-key
   OPENAI_API_KEY=your-openai-api-key
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```
5. Open `http://localhost:3000` in your browser.

## **Backend Implementation**
### **Database Schemas**
- **Message Schema:**
  ```ts
  export interface Message extends Document {
    content: string;
    createdAt: Date;
  }
  const messageSchema: Schema<Message> = new Schema({
    content: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
  });
  ```
- **User Schema:** Includes validation for emails, usernames, and authentication.

### **Authentication (NextAuth)**
- Supports Google OAuth and credential-based sign-ins.
- Stores authentication sessions in JWT tokens to minimize database calls.
- Example JWT customization:
  ```ts
  async jwt({ token, user }) {
    if (user) {
      token._id = user._id.toString();
      token.isVerified = user.isVerified;
      token.isAccepting = user.isAccepting;
    }
    return token;
  }
  ```

### **Mailing Service (Resend-Email API)**
- Sends email verification links.
- Uses React-based email templates for dynamic content.

## **Frontend Implementation**
### **UI and Components**
- **Framework:** Next.js with Tailwind CSS and Magic UI for responsiveness.
- **Pages:**
  - Home (`/`): Anonymous message board.
  - Auth (`/auth`): Login and sign-up pages.
  - Inbox (`/inbox`): View received messages.
  - Settings (`/settings`): Toggle message acceptance.
- **Components:**
  - **MessageInput:** Allows users to send anonymous messages.
  - **MessageCard:** Displays received messages.
  - **NotificationToast:** Shows success/error alerts.
  - **AI Message Suggestion:** Uses OpenAI API to suggest messages.

### **AI Integration**
- Suggests messages for users using OpenAI API.
- Plans to upgrade from GPT-3.5 to GPT-4o for better responses.

## **API Routes**
### **Authentication**
- `POST /api/auth/signup` – Registers a user.
- `POST /api/auth/signin` – Logs in a user.
- `GET /api/auth/session` – Fetches session details.

### **Messages**
- `POST /api/messages/send` – Sends a new anonymous message.
- `GET /api/messages/inbox` – Fetches received messages.
- `POST /api/messages/toggle-acceptance` – Enables/disables message reception.

## **Future Enhancements**
- Upgrade AI model to GPT-4o.
- Improve mobile UI/UX.
- Implement message encryption for better security.
- Add user avatars and themes.

## **Contributing**
Contributions are welcome! To contribute:
1. Fork the repo and create a new branch.
2. Commit your changes and push to your fork.
3. Submit a pull request.

## **License**
This project is open-source under the MIT License.

---
### **Contact**
For questions or feedback, contact `your-email@example.com` or open an issue in the repo.
