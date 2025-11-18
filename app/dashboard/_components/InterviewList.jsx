"use client";

import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import InterviewCard from "./InterviewCard";

const InterviewList = () => {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);

  const getInterviewList = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(
        eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress)
      )
      .orderBy(desc(MockInterview.id));
    // console.log(result);

    setInterviewList(result);
  };

  useEffect(() => {
    user && getInterviewList();
  }, [user]);

  return (
    <div>
      {interviewList.length > 0 ? (
        <>
          <h3 className="text-xl font-semibold mb-5">Previous Interviews</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {interviewList.map((interview) => (
              <InterviewCard key={interview.id} interview={interview} />
            ))}
          </div>
        </>
      ) : (
        <div className="mt-10 text-center text-gray-400 text-sm">
          No interviews yet. Start by creating one!
        </div>
      )}
    </div>
  );
};

export default InterviewList;
