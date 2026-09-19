"use client";

import { useState } from "react";
import { BrandMark, Icon } from "./icons";

export function MonitorPreview() {
  const [frequency, setFrequency] = useState("Weekly");
  const [paused, setPaused] = useState(false);
  return (
    <div className="monitor-preview">
      <div className="email-preview">
        <div className="email-envelope">
          <Icon name="mail" size={17} />
          <span>A little progress in your inbox</span>
          <span className="preview-label">Sample email</span>
        </div>
        <div className="email-content">
          <BrandMark />
          <h3>
            Your next role
            <br />
            might be in here.
          </h3>
          <p className="email-intro">
            2 new matches for your product engineering search.
          </p>
          {[
            {
              company: "Orbit",
              title: "Senior Product Engineer",
              reason: "Product ownership, remote from Germany.",
            },
            {
              company: "Fold",
              title: "Backend Engineer, Product",
              reason: "Customer-facing APIs. English-speaking team.",
            },
          ].map((job) => (
            <div key={job.company} className="email-job">
              <div>
                <span>{job.company}</span>
                <h4>{job.title}</h4>
                <p>{job.reason}</p>
              </div>
              <a
                href="#product-preview"
                aria-label={`Preview ${job.title} at ${job.company}`}
              >
                <Icon name="upRight" size={17} />
              </a>
            </div>
          ))}
          <p className="email-footer">
            Based on your saved preferences. Always yours to change.
          </p>
        </div>
      </div>
      <div className="monitor-settings">
        <div className="monitor-settings-heading">
          <Icon name="sliders" size={16} />
          <strong>Your search, your pace</strong>
          <span>Preview</span>
        </div>
        <div className="monitor-controls">
          <label htmlFor="email-frequency">
            Email me
            <select
              id="email-frequency"
              value={frequency}
              disabled={paused}
              onChange={(event) => setFrequency(event.target.value)}
            >
              <option>Daily</option>
              <option>Weekly</option>
            </select>
          </label>
          <button
            type="button"
            aria-pressed={paused}
            onClick={() => setPaused(!paused)}
          >
            <Icon name={paused ? "play" : "pause"} size={14} />
            {paused ? "Resume search" : "Pause search"}
          </button>
          <a href="#how-it-works">
            Edit criteria <Icon name="arrow" size={14} />
          </a>
        </div>
        <p className="monitor-state" aria-live="polite">
          {paused
            ? "Preview paused. No updates until you resume."
            : `Preview: ${frequency.toLowerCase()} updates when new roles match.`}
        </p>
      </div>
    </div>
  );
}
