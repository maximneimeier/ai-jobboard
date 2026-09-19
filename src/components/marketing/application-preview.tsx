"use client";

import { useState } from "react";
import { Icon } from "./icons";

export function ApplicationPreview() {
  const [document, setDocument] = useState<"cv" | "letter">("cv");
  return (
    <div className="application-preview">
      <div className="application-prompt">
        <Icon name="chat" size={18} />
        <span>Tailor my CV and draft a cover letter for this role.</span>
      </div>
      <div className="application-workspace">
        <div className="role-requirements">
          <span className="eyebrow">THE ROLE</span>
          <h3>Product Engineer</h3>
          <p>Orbit · Remote</p>
          <hr />
          <span className="small-label">What they’re looking for</span>
          <ul>
            <li>
              <Icon name="check" size={14} /> Customer-facing APIs
            </li>
            <li>
              <Icon name="check" size={14} /> End-to-end ownership
            </li>
            <li>
              <Icon name="check" size={14} /> Cross-functional work
            </li>
          </ul>
          <div className="experience-note">
            <Icon name="lock" size={15} />
            <p>
              Your experience.
              <br />
              The source of every line.
            </p>
          </div>
        </div>
        <div className="application-document-area">
          <div className="document-tabs" aria-label="Document preview">
            <button
              type="button"
              aria-pressed={document === "cv"}
              onClick={() => setDocument("cv")}
            >
              Tailored CV
            </button>
            <button
              type="button"
              aria-pressed={document === "letter"}
              onClick={() => setDocument("letter")}
            >
              Cover letter
            </button>
          </div>
          <div className="document-sheet" aria-live="polite">
            {document === "cv" ? (
              <>
                <div className="document-name">Alex Morgan</div>
                <p className="document-subtitle">Backend & Product Engineer</p>
                <div className="document-rule" />
                <span className="document-label">PROFILE</span>
                <p>
                  Engineer building thoughtful products, from the first API to
                  the customer experience.
                </p>
                <span className="document-label">RELEVANT EXPERIENCE</span>
                <div className="document-highlight">
                  <span className="document-annotation">
                    <Icon name="spark" size={11} /> Relevant project brought
                    forward
                  </span>
                  <strong>Customer workspace · Software Engineer</strong>
                  <p>
                    Built customer-facing APIs and shipped the workspace with
                    product and design.
                  </p>
                </div>
                <span className="document-label">SKILLS</span>
                <p>TypeScript · Node.js · PostgreSQL · API design</p>
              </>
            ) : (
              <>
                <span className="document-label">COVER LETTER · ORBIT</span>
                <div className="document-name letter-title">
                  A closer fit,
                  <br />
                  in your own words.
                </div>
                <p>Dear Orbit team,</p>
                <p>
                  I’m drawn to the opportunity to build features close to the
                  people who use them.
                </p>
                <div className="document-highlight">
                  <span className="document-annotation">
                    <Icon name="spark" size={11} /> Your experience, connected
                    to the role
                  </span>
                  <p>
                    On the customer workspace project, I built APIs and worked
                    with product and design to take features through to launch.
                  </p>
                </div>
                <p>
                  I’d love to bring that same ownership to your product team.
                </p>
                <p>Alex Morgan</p>
              </>
            )}
          </div>
          <div className="document-status">
            <Icon name="check" size={13} /> Draft for your review{" "}
            <span>Sample profile</span>
          </div>
        </div>
      </div>
    </div>
  );
}
