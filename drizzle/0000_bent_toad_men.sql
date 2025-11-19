CREATE TABLE "interviewAnalytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar NOT NULL,
	"interviewId" varchar NOT NULL,
	"totalQuestions" integer NOT NULL,
	"questionsAnswered" integer NOT NULL,
	"averageCommunicationScore" integer,
	"averageTechnicalScore" integer,
	"averageConfidenceScore" integer,
	"totalTimeSpent" integer,
	"completedAt" timestamp,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "mockInterview" (
	"id" serial PRIMARY KEY NOT NULL,
	"jsonMockResp" json NOT NULL,
	"jobPosition" varchar NOT NULL,
	"jobDesc" varchar NOT NULL,
	"jobExperience" varchar NOT NULL,
	"createdBy" varchar NOT NULL,
	"createdAt" varchar NOT NULL,
	"mockId" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "performanceMetrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"userEmail" varchar NOT NULL,
	"mockId" varchar NOT NULL,
	"overallScore" integer,
	"communicationScore" integer,
	"technicalScore" integer,
	"problemSolvingScore" integer,
	"confidenceScore" integer,
	"clarityScore" integer,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "resumeFiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar NOT NULL,
	"fileName" varchar NOT NULL,
	"fileUrl" varchar NOT NULL,
	"extractedText" text,
	"parsedData" json,
	"uploadedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "userAnswer" (
	"id" serial PRIMARY KEY NOT NULL,
	"mockId" varchar NOT NULL,
	"question" varchar NOT NULL,
	"correctAns" text,
	"userAns" text,
	"feedback" text,
	"rating" varchar,
	"userEmail" varchar,
	"createdAt" varchar
);
--> statement-breakpoint
CREATE TABLE "userAnswers" (
	"id" serial PRIMARY KEY NOT NULL,
	"interviewId" varchar NOT NULL,
	"questionIndex" integer NOT NULL,
	"question" text NOT NULL,
	"userAnswer" text NOT NULL,
	"audioRecordingUrl" varchar,
	"feedback" json,
	"createdAt" timestamp DEFAULT now()
);
