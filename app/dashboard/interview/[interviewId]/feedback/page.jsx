"use client";

import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Feedback = () => {
  const params = useParams();
  const router = useRouter();

  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    if (params.interviewId) {
      const getFeedback = async () => {
        const result = await db
          .select()
          .from(UserAnswer)
          .where(eq(UserAnswer.mockIdRef, params.interviewId))
          .orderBy(UserAnswer.id);
        setFeedbackList(result);
      };
      getFeedback();
    }
  }, [params.interviewId]);

  const averageRating =
    feedbackList.length > 0
      ? (
          feedbackList.reduce((sum, item) => {
            const rating = parseFloat(item.rating.split("/")[0]);
            return !isNaN(rating) && rating > 0 ? sum + rating : sum;
          }, 0) / feedbackList.length
        ).toFixed(1)
      : "N/A";

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      {feedbackList.length === 0 ? (
        <h2 className="text-xl font-semibold text-gray-400 text-center">
          ⚠️ No Interview Feedback Available
        </h2>
      ) : (
        <>
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-green-600">🎉 Great Job!</h2>
            <p className="text-xl font-semibold mt-2">
              Here's your interview feedback summary.
            </p>
            <p className="text-lg text-gray-600 mt-1">
              Overall Rating:{" "}
              <span className="text-blue-600 font-bold">
                {averageRating} / 5
              </span>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Below you'll find each question, your answer, the correct answer,
              and personalized feedback to improve.
            </p>
          </div>

          <div className="space-y-4">
            {feedbackList.map((item, index) => (
              <Collapsible key={index}>
                <CollapsibleTrigger className="w-full px-4 py-3 bg-secondary rounded-lg text-left hover:bg-gray-100 transition flex justify-between items-center text-md font-medium">
                  <span>
                    Q{index + 1}. {item.question}
                  </span>
                  <ChevronsUpDown className="h-5 w-5 text-gray-500" />
                </CollapsibleTrigger>

                <CollapsibleContent className="bg-white border rounded-lg p-4 space-y-3 shadow-sm">
                  <div className="text-sm bg-gray-50 border-l-4 border-yellow-400 p-3 rounded">
                    <strong>📊 Rating:</strong> {item.rating}
                  </div>

                  <div className="text-sm bg-red-50 border-l-4 border-red-400 p-3 rounded">
                    <strong>❌ Your Answer:</strong> {item.userAns}
                  </div>

                  <div className="text-sm bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <strong>✅ Correct Answer:</strong> {item.correctAns}
                  </div>

                  <div className="text-sm bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                    <strong>💡 Feedback:</strong> {item.feedback}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </>
      )}

      <div className="flex justify-center mt-8">
        <Button
          onClick={() => router.replace("/dashboard")}
          className="px-6 py-2"
        >
          ⬅ Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default Feedback;
