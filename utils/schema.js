import { pgTable, serial, varchar, text , integer,  json, timestamp } from "drizzle-orm/pg-core";

export const MockInterview = pgTable("mockInterview", {
  id: serial("id").primaryKey(),
  jsonMockResp: text("jsonMockResp").notNull(),
  jobPosition: varchar("jobPosition").notNull(),
  jobDesc: varchar("jobDesc").notNull(),
  jobExperience: varchar("jobExperience").notNull(),
  createdBy: varchar("createdBy").notNull(),
  createdAt: varchar("createdAt").notNull(),
  mockId: varchar("mockId").notNull(),
});

export const UserAnswer = pgTable("userAnswer", {
  id: serial("id").primaryKey(),
  mockIdRef: varchar("mockId").notNull(),
  question: varchar("question").notNull(),
  correctAns: text("correctAns"),
  userAns: text("userAns"),
  feedback: text("feedback"),
  rating: varchar("rating"),
  userEmail: varchar("userEmail"),
  createdAt: varchar("createdAt"),
});

// New: User Answers table
export const UserAnswers = pgTable("userAnswers", {
  id: serial("id").primaryKey(),
  interviewId: varchar("interviewId").notNull(),
  questionIndex: integer("questionIndex").notNull(),
  question: text("question").notNull(),
  userAnswer: text("userAnswer").notNull(),
  audioRecordingUrl: varchar("audioRecordingUrl"), // For voice answers
  feedback: json("feedback"), // AI evaluation scores and suggestions
  createdAt: timestamp("createdAt").defaultNow(),
});

// New: Resume Files table (for storing uploaded resumes)
export const ResumeFiles = pgTable("resumeFiles", {
  id: serial("id").primaryKey(),
  userId: varchar("userId").notNull(),
  fileName: varchar("fileName").notNull(),
  fileUrl: varchar("fileUrl").notNull(), // Store in cloud storage
  extractedText: text("extractedText"), // Raw extracted text
  parsedData: json("parsedData"), // Structured data
  uploadedAt: timestamp("uploadedAt").defaultNow(),
});

// New: Interview Analytics table
export const InterviewAnalytics = pgTable("interviewAnalytics", {
  id: serial("id").primaryKey(),
  userId: varchar("userId").notNull(),
  interviewId: varchar("interviewId").notNull(),
  totalQuestions: integer("totalQuestions").notNull(),
  questionsAnswered: integer("questionsAnswered").notNull(),
  averageCommunicationScore: integer("averageCommunicationScore"),
  averageTechnicalScore: integer("averageTechnicalScore"),
  averageConfidenceScore: integer("averageConfidenceScore"),
  totalTimeSpent: integer("totalTimeSpent"), // in minutes
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow(),
});
