"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { eq } from "drizzle-orm";

import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import Questions from "./_components/Questions";
import RecordingAns from "./_components/RecordingAns";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const StartInterview = () => {
  const params = useParams();

  const [interviewData, setInterviewData] = useState();
  const [mockInterviewQns, setMockInterviewQns] = useState();
  const [activeQnIndex, setActiveQnIndex] = useState(0);

  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId));

    const jsonMockResp = JSON.parse(result[0].jsonMockResp);

    console.log(jsonMockResp);

    setMockInterviewQns(jsonMockResp);
    setInterviewData(result[0]);
  };

  useEffect(() => {
    if (params.interviewId) {
      console.log(params.interviewId);
      GetInterviewDetails();
    }

    GetInterviewDetails();
  }, [params.interviewId]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Questions */}
        <Questions
          mockInterviewQns={mockInterviewQns}
          activeQnIndex={activeQnIndex}
        />

        {/* Video / Audio */}
        <RecordingAns
          mockInterviewQns={mockInterviewQns}
          activeQnIndex={activeQnIndex}
          interviewData={interviewData}
        />
      </div>

      <div className="flex justify-end gap-6">
        {activeQnIndex > 0 && (
          <Button onClick={() => setActiveQnIndex(activeQnIndex - 1)}>
            Previous Question
          </Button>
        )}
        {activeQnIndex != mockInterviewQns?.length - 1 && (
          <Button onClick={() => setActiveQnIndex(activeQnIndex + 1)}>
            Next Question
          </Button>
        )}
        {activeQnIndex == mockInterviewQns?.length - 1 && (
          <Link href={`/dashboard/interview/${interviewData?.mockId}/feedback`}>
            <Button>End Interview</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default StartInterview;
