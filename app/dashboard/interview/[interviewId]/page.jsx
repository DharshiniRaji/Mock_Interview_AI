"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Webcam from "react-webcam";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Lightbulb, WebcamIcon } from "lucide-react";

import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";

const Interview = () => {
  const params = useParams();
  const [interviewData, setInterviewData] = useState();
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId));

    setInterviewData(result[0]);
  };

  useEffect(() => {
    if (params.interviewId) {
      // console.log(params.interviewId);
      GetInterviewDetails();
    }
  }, [params.interviewId]);

  return (
    <div className="my-10 px-5 md:px-8">
      <h2 className="font-bold text-3xl mb-6">🎯 Let's Get Started</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="p-6 rounded-xl border bg-card shadow-sm space-y-4">
            <h3 className="text-lg">
              <strong className="text-primary">Job Role:</strong>{" "}
              <span className="capitalize">
                {interviewData?.jobPosition || "Loading..."}
              </span>
            </h3>
            <h3 className="text-lg">
              <strong className="text-primary">Tech Stack:</strong>{" "}
              {interviewData?.jobDesc || "Loading..."}
            </h3>
            <h3 className="text-lg">
              <strong className="text-primary">Experience:</strong>{" "}
              {interviewData?.jobExperience} year(s)
            </h3>
          </div>

          {/* Info Box */}
          <div className="p-5 border-l-4 border-yellow-400 bg-yellow-100 rounded-md shadow-sm">
            <div className="flex items-center gap-2 text-yellow-800 mb-2">
              <Lightbulb className="h-5 w-5" />
              <strong>Information</strong>
            </div>
            <p className="text-yellow-900 text-sm leading-relaxed">
              {process.env.NEXT_PUBLIC_INFORMATION}
            </p>
          </div>
        </div>

        {/* Webcam Section */}
        <div className="flex flex-col items-center justify-center">
          {webCamEnabled ? (
            <Webcam
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={() => setWebCamEnabled(false)}
              mirrored={true}
              className="rounded-lg border shadow-md w-full max-w-md h-[300px] object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="w-full max-w-md h-[300px] flex items-center justify-center bg-muted border rounded-lg">
                <WebcamIcon className="h-20 w-20 text-muted-foreground" />
              </div>
              <Button
                variant="outline"
                onClick={() => setWebCamEnabled(true)}
                className="w-full max-w-md"
              >
                🎥 Enable Webcam and Microphone
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end mt-10">
        <Link href={`/dashboard/interview/${params.interviewId}/start`}>
          <Button className="px-8 py-2 text-base">🚀 Start Interview</Button>
        </Link>
      </div>
    </div>
  );
};

export default Interview;
