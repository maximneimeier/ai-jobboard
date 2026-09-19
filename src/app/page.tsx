import { WaitlistForm } from "@/components/landing/waitlist-form";
import { ApplicationPreview } from "@/components/marketing/application-preview";
import { Brand, BrandMark, Icon } from "@/components/marketing/icons";
import { LandingEvents } from "@/components/marketing/landing-events";
import { MonitorPreview } from "@/components/marketing/monitor-preview";
import { MarketingNavigation } from "@/components/marketing/navigation";
import { ProductPreview } from "@/components/marketing/product-preview";
import "./marketing.css";

const benefits = [
  {
    icon: "globe" as const,
    title: "Straight from company career pages",
    text: "Go to the source. Discover roles on company websites and official hiring platforms, with a direct path to apply.",
  },
  {
    icon: "chat" as const,
    title: "A search that understands your preferences",
    text: "The work you enjoy. The things you need. The things you don’t. Say it in your own words, and keep refining.",
  },
  {
    icon: "document" as const,
    title: "Applications grounded in your experience",
    text: "Turn what you’ve actually done into a CV and cover letter that speak to the role in front of you.",
  },
];
const faqs = [
  {
    question: "Where do the jobs come from?",
    answer:
      "The product is being built to find roles on company career pages and their official applicant tracking systems. Results will link to the employer’s original listing, with the source and last-checked time. The roles and companies on this page are illustrative examples, not live vacancies.",
  },
  {
    question: "Can I change what I’m looking for?",
    answer:
      "Yes. Tell the assistant what to change, whether that’s a location, the kind of work, or companies to exclude. Your saved search keeps track of must-haves, preferences, and exclusions, so you can review and adjust them.",
  },
  {
    question: "Do I need an existing CV?",
    answer:
      "You’ll be able to upload your CV or build a profile by answering the assistant’s questions. You can add projects, skills, and experience as you go.",
  },
  {
    question: "Will it invent experience for my application?",
    answer:
      "Applications are designed to use facts you provide. If an important detail is missing, the assistant should ask you for it. You’ll be able to review and edit every draft before using it. There are no promises of an interview or a guaranteed ATS result.",
  },
  {
    question: "Does it apply on my behalf?",
    answer:
      "No. The first version will help you prepare a tailored CV and cover letter. You stay in control and submit the application directly to the employer yourself.",
  },
  {
    question: "What information does the service receive?",
    answer:
      "This preview does not collect your email, CV, or chat messages. The planned service will receive the profile details, documents, and search preferences you choose to share, and store them along with saved searches and application drafts. A connected assistant will share the information needed for the action you request; connecting will not grant automatic access to your entire chat history or platform memory. Data handling and retention details will be provided before early access.",
  },
  {
    question: "When can I use it?",
    answer:
      "The product is in development. Early-access registration is not open yet, and the form below is disabled. Once registration opens, you’ll be able to leave your email and receive an invitation as testing becomes available. ChatGPT and Claude integrations are planned, not available today.",
  },
];

function EarlyAccessLink({
  placement,
  children = "Join early access",
}: {
  placement: string;
  children?: React.ReactNode;
}) {
  return (
    <a
      href="#early-access"
      className="marketing-text-link"
      data-landing-event="cta_click"
      data-placement={placement}
    >
      {children}
      <Icon name="arrow" size={17} />
    </a>
  );
}

export default function Home() {
  return (
    <div className="marketing" id="top">
      <a className="marketing-skip-link" href="#main-content">
        Skip to content
      </a>
      <LandingEvents />
      <MarketingNavigation />
      <main id="main-content">
        <section className="marketing-hero" aria-labelledby="hero-title">
          <div className="hero-grid" aria-hidden="true" />
          <div className="marketing-container hero-content">
            <span className="hero-eyebrow">
              <span className="status-dot" /> A new direction for your job
              search
            </span>
            <h1 id="hero-title">
              Chat native
              <br />
              <span>AI job search.</span>
            </h1>
            <p className="hero-description">
              Find jobs directly on company websites. Refine your search in
              conversation and turn your experience into tailored applications.
            </p>
            <div className="hero-actions">
              <a
                className="marketing-button"
                href="#early-access"
                data-landing-event="cta_click"
                data-placement="hero"
              >
                Join early access <Icon name="arrow" size={18} />
              </a>
              <a
                className="marketing-secondary-button"
                href="#product-preview"
                data-landing-event="see_how_it_works"
                data-placement="hero"
              >
                <Icon name="play" size={14} /> See how it works
              </a>
            </div>
            <div className="hero-integration-note">
              <span>Built for the way you already chat.</span>
              <span className="integration-platform">
                <Icon name="spark" size={14} /> ChatGPT <i>Planned</i>
              </span>
              <span className="integration-platform">
                <span className="claude-symbol" aria-hidden="true">
                  ✳
                </span>{" "}
                Claude <i>Planned</i>
              </span>
            </div>
            <div className="hero-preview-wrap">
              <div className="preview-caption">
                <span>LESS SEARCHING. MORE FINDING.</span>
                <span>01 — THE CONVERSATION</span>
              </div>
              <ProductPreview />
            </div>
          </div>
        </section>

        <section
          className="marketing-benefits marketing-container"
          aria-label="A more thoughtful way to find work"
        >
          {benefits.map((benefit, index) => (
            <article key={benefit.title}>
              <div className="benefit-icon">
                <Icon name={benefit.icon} size={22} />
                <span>0{index + 1}</span>
              </div>
              <h2>{benefit.title}</h2>
              <p>{benefit.text}</p>
            </article>
          ))}
        </section>

        <section
          className="marketing-section conversation-section"
          id="how-it-works"
          aria-labelledby="conversation-title"
        >
          <div className="marketing-container">
            <div className="section-heading">
              <p className="eyebrow">
                <span /> THE SEARCH, IN YOUR WORDS
              </p>
              <h2 id="conversation-title">
                Your next search
                <br />
                starts with a sentence.
              </h2>
              <p>
                You know what a good fit feels like.
                <br />
                Now you can put it into words.
              </p>
            </div>
            <div className="conversation-layout">
              <div className="conversation-steps">
                <article>
                  <span className="step-number">01</span>
                  <div>
                    <h3>Describe what you’re looking for.</h3>
                    <p>
                      A role, an ambition, a few non-negotiables.
                      <br />
                      Start wherever you are.
                    </p>
                  </div>
                </article>
                <article>
                  <span className="step-number">02</span>
                  <div>
                    <h3>Understand why a role fits.</h3>
                    <p>
                      Get a shortlist with clear reasons, potential gaps, and a
                      link to the original listing.
                    </p>
                  </div>
                </article>
                <article>
                  <span className="step-number">03</span>
                  <div>
                    <h3>Refine it. Make it yours.</h3>
                    <p>
                      Keep the conversation going. Your results and saved
                      preferences move with you.
                    </p>
                  </div>
                </article>
                <EarlyAccessLink placement="conversation" />
              </div>
              <div className="conversation-visual">
                <div className="example-refinements">
                  <span className="small-label">
                    A FEW WORDS CAN CHANGE THE SEARCH
                  </span>
                  <p>“Only companies building their own product.”</p>
                  <p>“I’m open to adjacent roles.”</p>
                  <p>“Exclude consulting.”</p>
                  <p>“Show me roles where German is optional.”</p>
                </div>
                <div className="saved-criteria">
                  <div className="saved-criteria-heading">
                    <span>
                      <Icon name="sliders" size={17} /> Your search
                    </span>
                    <span>
                      <Icon name="check" size={13} /> Saved preferences
                    </span>
                  </div>
                  <dl>
                    <div>
                      <dt>Must-haves</dt>
                      <dd>
                        <span>Remote from Germany</span>
                        <span>English-speaking</span>
                      </dd>
                    </div>
                    <div>
                      <dt>Preferences</dt>
                      <dd>
                        <span>Product companies</span>
                        <span>Product engineering</span>
                      </dd>
                    </div>
                    <div>
                      <dt>Exclude</dt>
                      <dd>
                        <span className="excluded-tag">
                          Consulting <Icon name="close" size={10} />
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="marketing-section applications-section"
          id="applications"
          aria-labelledby="applications-title"
        >
          <div className="marketing-container feature-layout">
            <div className="feature-copy">
              <p className="eyebrow">
                <span /> THE NEXT STEP, TAKEN CARE OF
              </p>
              <h2 id="applications-title">
                From a promising role to a tailored application.
              </h2>
              <p>
                A good match is only the beginning. Bring your most relevant
                experience forward, with documents shaped around the role.
              </p>
              <ul className="feature-list">
                <li>
                  <Icon name="check" size={17} /> Built from the facts you
                  share.
                </li>
                <li>
                  <Icon name="check" size={17} /> A question when something is
                  missing.
                </li>
                <li>
                  <Icon name="check" size={17} /> Yours to review, edit, and
                  send.
                </li>
                <li>
                  <Icon name="check" size={17} /> A separate application set for
                  every role.
                </li>
              </ul>
              <EarlyAccessLink placement="applications" />
              <p className="feature-footnote">
                Your story, thoughtfully told. Never invented.
              </p>
            </div>
            <div>
              <div className="section-preview-caption">
                <span>02 — THE APPLICATION</span>
                <span>Product preview</span>
              </div>
              <ApplicationPreview />
            </div>
          </div>
        </section>

        <section
          className="marketing-section monitoring-section"
          id="keep-searching"
          aria-labelledby="monitoring-title"
        >
          <div className="marketing-container feature-layout monitoring-layout">
            <div>
              <div className="section-preview-caption">
                <span>03 — THE MOMENTUM</span>
                <span>Product preview</span>
              </div>
              <MonitorPreview />
            </div>
            <div className="feature-copy">
              <p className="eyebrow">
                <span /> A SEARCH THAT STAYS WITH YOU
              </p>
              <h2 id="monitoring-title">
                Keep the
                <br />
                search moving.
              </h2>
              <p>
                Save your preferences and get new matching roles by email. A
                thoughtful shortlist, ready when you are.
              </p>
              <ul className="feature-list">
                <li>
                  <Icon name="check" size={17} /> New roles, with reasons they
                  fit.
                </li>
                <li>
                  <Icon name="check" size={17} /> A schedule that works for you.
                </li>
                <li>
                  <Icon name="check" size={17} /> Change direction or pause at
                  any time.
                </li>
              </ul>
              <EarlyAccessLink placement="monitoring" />
            </div>
          </div>
        </section>

        <section
          className="marketing-section faq-section"
          id="faq"
          aria-labelledby="faq-title"
        >
          <div className="marketing-container faq-layout">
            <div>
              <p className="eyebrow">
                <span /> GOOD QUESTIONS
              </p>
              <h2 id="faq-title">
                A little clarity
                <br />
                before you start.
              </h2>
              <p>
                A job search is personal.
                <br />
                You should know how yours works.
              </p>
              <div className="faq-trust-note">
                <Icon name="lock" size={18} />
                <span>
                  Your information.
                  <br />
                  Your decisions. Your next move.
                </span>
              </div>
            </div>
            <div className="faq-list">
              {faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>
                    {faq.question}
                    <Icon name="plus" size={18} />
                  </summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section
          className="early-access-section"
          id="early-access"
          aria-labelledby="early-access-title"
        >
          <div className="marketing-container early-access-inner">
            <div className="early-access-symbol" aria-hidden="true">
              <BrandMark />
            </div>
            <p className="eyebrow">A BETTER SEARCH STARTS HERE</p>
            <h2 id="early-access-title">
              Let’s find
              <br />
              your next role.
            </h2>
            <p>Less time looking. More space for what comes next.</p>
            <WaitlistForm />
            <span className="early-access-development">
              <span className="status-dot" /> In development · Invitations will
              roll out as the product is ready.
            </span>
          </div>
        </section>
      </main>
      <footer className="marketing-footer">
        <div className="marketing-container">
          <div className="footer-top">
            <div>
              <a href="#top" aria-label="[Name] home">
                <Brand />
              </a>
              <p>Chat native AI job search.</p>
            </div>
            <nav aria-label="Footer navigation">
              <a href="#how-it-works">How it works</a>
              <a href="#applications">Applications</a>
              <a href="#keep-searching">Stay in the loop</a>
              <a href="#faq">FAQ</a>
            </nav>
            <span className="footer-status">
              <span className="status-dot" /> Something good is in the works.
            </span>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Atheniks</p>
            <span>A little more direction. A lot more possibility.</span>
            <a href="#faq">
              About your data <Icon name="upRight" size={12} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
