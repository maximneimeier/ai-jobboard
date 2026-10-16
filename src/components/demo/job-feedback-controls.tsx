"use client";

import { useState } from "react";
import {
  FEEDBACK_REASON_LABEL,
  type FeedbackAction,
  type FeedbackReason,
} from "@/lib/demo/store";

const REASONS: FeedbackReason[] = [
  "wrong_role",
  "wrong_location",
  "salary",
  "seniority",
  "industry",
  "other",
];

export function JobFeedbackControls({
  value,
  onFeedback,
}: {
  value?: FeedbackAction;
  onFeedback: (action: FeedbackAction, reason?: FeedbackReason) => void;
}) {
  const [askWhy, setAskWhy] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <button
        type="button"
        aria-pressed={value === "interested"}
        onClick={() => {
          setAskWhy(false);
          onFeedback("interested");
        }}
        className={chip(value === "interested")}
      >
        Interested
      </button>
      <button
        type="button"
        aria-pressed={value === "not_interested"}
        onClick={() => setAskWhy((open) => !open)}
        className={chip(value === "not_interested")}
      >
        Not interested
      </button>
      {askWhy ? (
        <div className="flex w-full flex-wrap gap-1.5 pt-1">
          {REASONS.map((reason) => (
            <button
              key={reason}
              type="button"
              onClick={() => {
                onFeedback("not_interested", reason);
                setAskWhy(false);
              }}
              className="inline-flex h-7 items-center rounded-full px-2.5 text-[12px] text-ink ring-1 ring-hairline hover:bg-canvas"
            >
              {FEEDBACK_REASON_LABEL[reason]}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function chip(on: boolean) {
  return on
    ? "inline-flex h-8 items-center rounded-lg bg-canvas px-2.5 text-[12px] font-medium text-ink ring-1 ring-ink"
    : "inline-flex h-8 items-center rounded-lg px-2.5 text-[12px] font-medium text-muted ring-1 ring-hairline hover:text-ink";
}
