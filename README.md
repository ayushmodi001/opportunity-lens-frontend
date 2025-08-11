# Opportunity Lens 🔎

<p align="center">
  <img src="./public/logo.svg" alt="Opportunity Lens Logo" width="120">
</p>

<h3 align="center">AI-Powered Assessments for Personalized Career Guidance</h3>

<p align="center">
  Opportunity Lens is a modern, AI-driven web application designed to help users assess their knowledge across various subjects and professional degrees. It provides personalized quizzes, detailed performance analysis, and a seamless, secure user experience.
</p>

---

## 🚀 Features

-   **🔐 Secure Authentication**: Robust login and signup system with email/password credentials and Google OAuth, powered by NextAuth.js.
-   **🧠 Dynamic Assessment Center**:
    -   Choose between general knowledge topics or specific professional degree paths.
    -   Select multiple topics of interest.
    -   Adjust proficiency levels (Easy, Medium, Hard) to tailor the assessment.
-   **📝 Interactive Quiz Interface**:
    -   A clean, focused, fullscreen quiz environment.
    -   Built-in timer and violation tracking to ensure test integrity.
-   **📊 In-Depth Results & Analytics**:
    -   Instant feedback upon quiz completion.
    -   Detailed performance breakdown with charts for score distribution, time usage, and more.
    -   Review your answers to understand mistakes and learn.
-   **🎨 Modern UI/UX**:
    -   Sleek, responsive design built with **Next.js** and **shadcn/ui**.
    -   Engaging animations and micro-interactions.
    -   Full support for **Light and Dark Modes**.
-   **🔔 Real-time Notifications**: Integrated toast notifications for a better user experience during login, signup, and other actions.

## 🛠️ Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) 14 (App Router)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
-   **Authentication**: [NextAuth.js](https://next-auth.js.org/)
-   **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Icons**: [Lucide React](https://lucide.dev/)

## 📋 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18.x or later)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   A MongoDB database instance (local or cloud-based like MongoDB Atlas)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/opportunity-lens-frontend.git
    cd opportunity-lens-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Create a file named `.env` in the root of the project and add the following variables. Replace the placeholder values with your actual credentials.

    ```env
    # Google OAuth Credentials
    GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
    GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"

    # NextAuth.js Secret
    # Generate one here: https://generate-secret.vercel.app/32
    NEXTAUTH_SECRET="YOUR_NEXTAUTH_SECRET"
    NEXTAUTH_URL="http://localhost:3000"

    # MongoDB Connection String
    MONGO_DB_CONNECTION_STRING="YOUR_MONGODB_CONNECTION_STRING"

    # External API Key (if any)
    MODEL_API_KEY="YOUR_MODEL_API_KEY"
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

