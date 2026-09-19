import { Icon } from "@/components/marketing/icons";

export function WaitlistForm() {
  return (
    <div className="early-access-form" aria-describedby="early-access-status">
      <div className="early-access-fields">
        <label className="sr-only" htmlFor="waitlist-email">
          Your email address
        </label>
        <div className="early-access-input">
          <Icon name="mail" size={19} />
          <input
            id="waitlist-email"
            type="email"
            placeholder="Your email address"
            disabled
          />
        </div>
        <button type="button" className="marketing-button" disabled>
          Join early access <Icon name="arrow" size={17} />
        </button>
      </div>
      <p id="early-access-status">
        <Icon name="clock" size={14} /> Early access isn’t open yet. Sign-ups
        are coming soon.
      </p>
    </div>
  );
}
