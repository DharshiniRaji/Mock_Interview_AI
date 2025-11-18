# 🤖 AI Mock Interview Platform

An AI-powered mock interview platform designed to help users practice their interview skills and receive instant feedback. This project allows users to interact with AI-generated interview questions and get real-time assessments and feedback on their responses.

## [Live Link](https://quest-ai-eight.vercel.app/dashboard)

## ✨ Features

- 🎤 **Interactive Mock Interviews**: Users can record answers to interview questions.
- 💬 **AI-Generated Feedback**: Gemini AI analyzes user responses and provides ratings and feedback.
- 🔒 **Security & Authentication**: Clerk is used to securely manage user authentication.
- 📱 **Responsive Design**: Built with Next.js and React for a smooth, responsive user experience.
- 🗄️ **Database Management**: Drizzle ORM integrated with NeonDB for efficient data handling.

## 🛠️ Tech Stack

- ⚡ **Next.js**: Used as the main framework for the project.
- ⚛️ **React**: Responsible for building a responsive and dynamic user interface.
- 🗄️ **Drizzle ORM**: Used for database management and querying.
- 💾 **NeonDB**: Database used for storing mock interview data.
- 🧠 **Gemini AI**: Integrated for generating AI-powered

## 🚀 Getting Started

### 1. Clone the repository:

```bash
git clone https://github.com/danielace1/ai-mock-interview.git
```

### 2. Navigate to the project directory:

```bash
cd ai-mock-interview
```

### 3. Install dependencies:

```bash
npm install
```

### 4. Set up environment variables:

- Create a .env.local file and add your environment variables:

```bash
NEXT_PUBLIC_CLERK_FRONTEND_API=<Your Clerk API Key>
CLERK_API_KEY=<Your Clerk Backend API Key>
GEMINI_API_KEY=<Your Gemini API Key>
DATABASE_URL=<Your NeonDB connection URL>
```

### 5. Run the development server:

```bash
npm run dev
```

### 6. Open your browser and visit http://localhost:3000.

## 🔮 Future Improvements

- 📄 **Resume Upload Feature**: Users can upload their resumes for AI-driven feedback, similar to ATS systems.
- 🧑‍💻 **Score Analysis**: Provide users with detailed scores on their resume and interview performance.
- 📝 **Custom Interview Sets**: Users can create their own sets of interview questions for personalized practice.

## 🤝 Contribution

Contributions are welcome! Feel free to fork this repository, [open issues](https://github.com/danielace1/ai-mock-interview/issues), or submit [pull requests](https://github.com/danielace1/ai-mock-interview/pulls).

## 📜 License

This project is open-source and available under the [MIT](./License) License.

#### 💡 Feel free to reach out if you have any questions or ideas to improve the platform!

## Author

- [Sudharsan](https://www.facebook.com/sudharsandaniel01)
