export type MailDecision = "offer" | "rejection";

export type InboxReply = {
  jobId: string;
  decision: MailDecision;
  subject: string;
  from: string;
  receivedOn: string;
};

export const MAIL_DECISION_LABEL: Record<MailDecision, string> = {
  offer: "Offer",
  rejection: "Rejection",
};

/** Sample replies for the demo inbox. They only surface after the account email is connected. */
export const INBOX_REPLIES: InboxReply[] = [
  {
    jobId: "sse-northline",
    decision: "offer",
    subject: "Offer for Senior Software Engineer",
    from: "talent@northline.example",
    receivedOn: "2026-10-16",
  },
  {
    jobId: "se-helix",
    decision: "rejection",
    subject: "Your application at Helix Cloud",
    from: "hiring@helixcloud.example",
    receivedOn: "2026-10-15",
  },
  {
    jobId: "fs-rivet",
    decision: "rejection",
    subject: "Update on the Full Stack Engineer role",
    from: "jobs@rivet.example",
    receivedOn: "2026-10-14",
  },
];

export function inboxReplyFor(jobId: string) {
  return INBOX_REPLIES.find((reply) => reply.jobId === jobId) ?? null;
}

export function statusForDecision(decision: MailDecision): "offer" | "rejected" {
  return decision === "offer" ? "offer" : "rejected";
}

export function mailDecisionClass(decision: MailDecision) {
  return decision === "offer"
    ? "bg-success-soft text-success-text"
    : "bg-danger-soft text-danger-text";
}
