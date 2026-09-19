"use client";

import { useState } from "react";
import { BrandMark, Icon } from "./icons";

const initialJobs = [
  {
    company: "Orbit",
    mark: "◉",
    role: "Senior Backend Engineer",
    tags: "Remote · Germany · English",
    fit: "Build APIs for a European product team.",
    gap: "Some infrastructure ownership.",
    tone: "orbit",
  },
  {
    company: "Layers",
    mark: "▧",
    role: "Backend Engineer, Platform",
    tags: "Remote · Europe · English",
    fit: "Your backend experience, at a product company.",
    gap: "The role is mostly platform work.",
    tone: "layers",
  },
];
const refinedJobs = [
  {
    company: "Orbit",
    mark: "◉",
    role: "Senior Product Engineer",
    tags: "Remote · Germany · English",
    fit: "Own customer-facing features from API to launch.",
    gap: "Some frontend work is expected.",
    tone: "orbit",
  },
  {
    company: "Fold",
    mark: "⫻",
    role: "Backend Engineer, Product",
    tags: "Remote · Europe · English",
    fit: "Build the core product, close to users and design.",
    gap: "Payments experience is a plus.",
    tone: "fold",
  },
];

export function ProductPreview() {
  const [refined, setRefined] = useState(false);
  const jobs = refined ? refinedJobs : initialJobs;
  return (
    <div className="product-preview" id="product-preview">
      <div className="preview-toolbar">
        <span className="preview-title">
          <BrandMark /> Your next chapter
        </span>
        <span className="preview-label">
          <span className="status-dot" /> Product preview
        </span>
      </div>
      <div className="preview-workspace">
        <div className="preview-conversation">
          <div className="preview-section-label">
            <Icon name="chat" size={15} /> A conversation, with direction
          </div>
          <div className="preview-user-message">
            <span className="message-label">You</span>
            <p>
              Find backend roles at European product companies. Remote from
              Germany, no German required.
            </p>
          </div>
          <div className="preview-assistant-message">
            <span className="assistant-avatar">
              <BrandMark />
            </span>
            <div>
              <p>
                I’ll look on company career pages for roles that fit. Here’s a
                starting point.
              </p>
              <div className="preview-inline-tags">
                <span>
                  <Icon name="check" size={12} /> Direct sources
                </span>
                <span>
                  <Icon name="check" size={12} /> Your criteria
                </span>
              </div>
            </div>
          </div>
          <div className={`preview-refinement ${refined ? "is-refined" : ""}`}>
            <span className="message-label">
              {refined ? "You" : "Try a follow-up"}
            </span>
            <button
              type="button"
              aria-pressed={refined}
              onClick={() => setRefined(!refined)}
              data-landing-event="demo_refine"
              data-placement="hero"
            >
              <span>
                More product engineering,
                <br className="desktop-break" /> less infrastructure.
              </span>
              <span className="refine-send">
                <Icon name={refined ? "refresh" : "arrow"} size={17} />
              </span>
            </button>
          </div>
          <div className="preview-response" aria-live="polite">
            <Icon name={refined ? "check" : "spark"} size={15} />
            <span>
              {refined
                ? "Got it. More product ownership, less platform work."
                : "A small refinement. A more relevant search."}
            </span>
          </div>
        </div>
        <div className="preview-results">
          <div className="preview-results-heading">
            <span>
              {refined ? "Your refined matches" : "A few promising matches"}
            </span>
            <span>02 roles</span>
          </div>
          <div
            className="preview-job-list"
            aria-live="polite"
            aria-atomic="true"
          >
            {jobs.map((job) => (
              <article
                key={job.role}
                className="preview-job-card preview-enter"
              >
                <div className="preview-company-row">
                  <span className={`company-mark ${job.tone}`}>{job.mark}</span>
                  <span>
                    {job.company}
                    <small>Company career page</small>
                  </span>
                  <Icon name="upRight" size={16} />
                </div>
                <h3>{job.role}</h3>
                <p className="job-meta">{job.tags}</p>
                <p className="job-fit">
                  <Icon name="check" size={14} />
                  <span>
                    <strong>Why it fits</strong> {job.fit}
                  </span>
                </p>
                <p className="job-gap">
                  <strong>Potential gaps</strong> {job.gap}
                </p>
                <div className="job-checked">
                  <Icon name="clock" size={11} /> Last checked: today{" "}
                  <span>Example</span>
                </div>
              </article>
            ))}
          </div>
          <div className="preview-saved-search">
            <Icon name="sliders" size={16} />
            <span>
              <strong>Your search</strong>
              <span>
                {refined
                  ? "Product ownership · Remote DE · English"
                  : "Backend · Remote DE · English"}
              </span>
            </span>
            <span className="saved-indicator">
              {refined ? "Updated" : "Saved"}
              <Icon name="check" size={12} />
            </span>
          </div>
        </div>
      </div>
      <div className="preview-bottom-bar">
        <span>
          <span className="status-dot" /> Your preferences stay with the search.
        </span>
        <span>Illustrative roles & companies</span>
      </div>
    </div>
  );
}
