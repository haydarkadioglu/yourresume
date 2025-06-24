# YourResume - Professional CV Builder

YourResume is a modern, web-based application designed to help users effortlessly create, manage, and share professional resumes. With an intuitive interface and multiple templates, you can craft a polished, ATS-friendly CV in minutes.



## ✨ Key Features

- **Intuitive Editor**: Easily fill in your personal information, work experience, education, skills, and more through a user-friendly dashboard.
- **Multiple Templates**: Choose from a selection of beautifully designed templates (Classic, Modern, Minimalist) to best showcase your professional story.
- **ATS-Friendly**: Our templates are structured to be easily parsed by Applicant Tracking Systems, increasing your chances of getting noticed.
- **PDF Download**: Download a pixel-perfect PDF of your resume directly from the browser.
- **Multi-language Support**: The interface is available in both English and Turkish.
- **Secure**: User data is securely stored in Firebase, and login activity is tracked for enhanced security.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **UI**: [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/)
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Authentication, Firestore)
- **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit) (for future AI-powered features)

## 🛠️ Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    You will need to set up your Firebase project configuration as environment variables. In a local development environment, you can create a `.env.local` file in the root of the project. For production deployments (e.g., on Vercel), add these in your hosting provider's dashboard.

    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
    ```

### Running the Development Server

To run the app locally, use the following command:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## 📜 Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts a production server.
- `npm run lint`: Runs the linter.
