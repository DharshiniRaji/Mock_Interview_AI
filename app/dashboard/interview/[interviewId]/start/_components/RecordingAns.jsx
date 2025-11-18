"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import { useUser } from "@clerk/nextjs";

import {
  AlertTriangleIcon,
  CheckCircleIcon,
  Mic,
  StopCircleIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAIModel";
import { db } from "@/utils/db";
import moment from "moment";
import { UserAnswer } from "@/utils/schema";

const RecordingAns = ({ mockInterviewQns, activeQnIndex, interviewData }) => {
  const [userAns, setUserAns] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    results.forEach((result) => {
      setUserAns((prev) => prev + result?.transcript);
    });
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAns.length > 10) {
      updateUserAns();
    }
  }, [userAns]);

  const startStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
  };

  const updateUserAns = async () => {
    console.log("User Answer: ", userAns);

    setLoading(true);
    const feedbackPrompt =
      "Question: " +
      mockInterviewQns[activeQnIndex]?.Question +
      ", User Answer: " +
      userAns +
      ". Based on the question and user answer, please provide a rating and feedback for improvement. " +
      "Provide your response in JSON format with 'rating' and 'feedback' fields. " +
      "Keep the feedback brief (3-5 lines) and focus on areas of improvement.";

    const result = await chatSession.sendMessage(feedbackPrompt);

    const mockJsonResponse = result.response
      .text()
      .replace("```json", "")
      .replace("```", "");

    const jsonResponse = JSON.parse(mockJsonResponse);

    const resp = await db.insert(UserAnswer).values({
      mockIdRef: interviewData?.mockId,
      question: mockInterviewQns[activeQnIndex]?.Question,
      correctAns: mockInterviewQns[activeQnIndex]?.Answer,
      userAns: userAns,
      feedback: jsonResponse?.feedback,
      rating: jsonResponse?.rating,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      createdAt: moment().format("DD-MM-YYYY"),
    });

    if (resp) {
      toast(
        <div className="flex items-center">
          <CheckCircleIcon className="text-green-500 mr-1 size-4" /> Your answer
          has been saved successfully.
        </div>
      );
      setUserAns("");
      setResults([]);
    }

    setResults([]);
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5">
        <Image
          src="/webcam.png"
          width={200}
          height={200}
          className="absolute"
          alt="Webcam"
          priority
        />
        <Webcam
          mirrored={true}
          style={{
            width: "100%",
            height: 300,
            zIndex: 10,
          }}
        />
      </div>
      <Button
        disabled={loading}
        variant="outline"
        className="my-10 "
        onClick={startStopRecording}
      >
        {isRecording ? (
          <>
            <h2 className="flex items-center gap-x-2 text-red-500 animate-pulse">
              <StopCircleIcon />
              Stop Recording
            </h2>
          </>
        ) : (
          <h2 className="flex items-center gap-x-2 text-primary">
            <Mic />
            Record Answer...
          </h2>
        )}
      </Button>
    </div>
  );
};

export default RecordingAns;
