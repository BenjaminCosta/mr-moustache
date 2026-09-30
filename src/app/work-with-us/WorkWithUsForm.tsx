"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowRightIcon, ChevronRightIcon } from "@/components/ui/Icons";
import { FORMSUBMIT_ACTION } from "@/lib/constants";

const FORM_TARGET = "formsubmit-work-with-us-frame";
import { EXPERIENCE_OPTIONS, LOCATION_OPTIONS, type ApplicationField } from "./options";

const labelClasses =
  "block text-[0.55rem] font-medium uppercase leading-none tracking-[0.3em] text-foreground/80 lg:text-[0.68rem]";

const controlClasses =
  "mt-[0.55rem] block w-full rounded-[0.4rem] border border-white/20 bg-[#0c0c0c]/85 px-[0.9rem] text-base text-foreground transition-colors duration-200 placeholder:text-foreground/35 hover:border-white/40 focus:border-primary focus:outline-none lg:mt-3 lg:px-5";

type FieldProps = {
  name: ApplicationField | "phone";
  label: string;
  children: (props: { id: string; name: string }) => ReactNode;
};

function Field({ name, label, children }: FieldProps) {
  const id = `work-with-us-${name}`;
  return (
    <div>
      <label htmlFor={id} className={labelClasses}>
        {label}
      </label>
      {children({ id, name })}
    </div>
  );
}

function SelectChevron() {
  return (
    <ChevronRightIcon
      aria-hidden="true"
      className="pointer-events-none absolute right-[1rem] top-1/2 h-[0.8rem] w-[0.45rem] -translate-y-1/2 rotate-90 text-foreground/65 transition-[transform,color] duration-200 ease-out will-change-transform group-hover:scale-110 group-hover:text-foreground group-focus-within:rotate-[270deg] group-focus-within:text-primary motion-reduce:transition-none lg:right-5"
    />
  );
}

/**
 * Posts the application to FormSubmit (https://formsubmit.co) as a regular
 * form into a hidden iframe, the same setup as santosbecker.com's contact form:
 * no CORS, and the visitor stays on the page. The browser checks the required
 * fields; "sent" shows once the iframe loads FormSubmit's answer (or after 5 s).
 */
export function WorkWithUsForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const hasSubmittedRef = useRef(false);
  const fallbackTimerRef = useRef<number | null>(null);

  function finishSubmit() {
    // The iframe also fires "load" for its initial blank page; ignore that one.
    if (!hasSubmittedRef.current) return;

    hasSubmittedRef.current = false;
    if (fallbackTimerRef.current) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    setStatus("sent");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Honeypot: bots tick it, people never see it.
    if (new FormData(event.currentTarget).get("botcheck")) {
      event.preventDefault();
      return;
    }

    hasSubmittedRef.current = true;
    setStatus("sending");
    if (fallbackTimerRef.current) window.clearTimeout(fallbackTimerRef.current);
    fallbackTimerRef.current = window.setTimeout(finishSubmit, 5000);
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        className="rounded-[0.5rem] border border-white/20 bg-[#0c0c0c]/85 px-[1.2rem] py-[1.6rem] text-center lg:rounded-[0.75rem] lg:px-12 lg:py-14"
      >
        <p className="font-display text-[1.6rem] font-bold leading-none text-white lg:text-[2.5rem]">
          Application sent
        </p>
        <p className="mt-[0.7rem] text-[0.9rem] leading-[1.3] text-foreground/80 lg:mt-5 lg:text-[1.1rem]">
          Thanks for applying. We&apos;ll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <>
      <iframe name={FORM_TARGET} title="Application submission" className="hidden" onLoad={finishSubmit} />
      <form
        action={FORMSUBMIT_ACTION}
        method="POST"
        target={FORM_TARGET}
        onSubmit={handleSubmit}
        className="space-y-[1.15rem] lg:space-y-7"
      >
        <input type="hidden" name="_subject" defaultValue="New Work With Us application" />
        <input type="hidden" name="_template" defaultValue="table" />
        <input type="hidden" name="_captcha" defaultValue="false" />
        <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <div className="grid gap-[1.15rem] lg:grid-cols-2 lg:gap-7">
          <Field name="name" label="Name">
            {(props) => (
              <input {...props} type="text" autoComplete="name" required className={`${controlClasses} h-[2.9rem] lg:h-14`} />
            )}
          </Field>
          <Field name="email" label="Email">
            {(props) => (
              <input {...props} type="email" autoComplete="email" required className={`${controlClasses} h-[2.9rem] lg:h-14`} />
            )}
          </Field>
          <Field name="phone" label="Phone">
            {(props) => (
              <input {...props} type="tel" autoComplete="tel" className={`${controlClasses} h-[2.9rem] lg:h-14`} />
            )}
          </Field>
          <Field name="experience" label="Experience">
            {(props) => (
              <span className="group relative block">
                <select {...props} required defaultValue="" className={`${controlClasses} h-[2.9rem] appearance-none pr-10 lg:h-14`}>
                  <option value="" disabled>
                    Select
                  </option>
                  {EXPERIENCE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <SelectChevron />
              </span>
            )}
          </Field>
        </div>

        <Field name="location" label="Preferred location">
          {(props) => (
            <span className="group relative block">
              <select {...props} required defaultValue="" className={`${controlClasses} h-[2.9rem] appearance-none pr-10 lg:h-14`}>
                <option value="" disabled>
                  Select
                </option>
                {LOCATION_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <SelectChevron />
            </span>
          )}
        </Field>

        <Field name="message" label="Message">
          {(props) => (
            <textarea
              {...props}
              required
              rows={5}
              placeholder="Tell us about your experience, the cuts you love and when you could start."
              className={`${controlClasses} resize-y py-[0.8rem] leading-[1.4] lg:py-4`}
            />
          )}
        </Field>

        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-sweep btn-sweep--invert-primary group flex h-[2.6rem] w-full items-center justify-center gap-[1.15rem] rounded-full border-[1.5px] border-primary bg-primary text-[0.72rem] font-medium uppercase tracking-[0.2em] text-white disabled:cursor-progress disabled:opacity-70 lg:h-14 lg:w-auto lg:gap-5 lg:px-12 lg:text-[0.85rem] lg:tracking-[0.24em]"
        >
          {status === "sending" ? "Sending…" : "Send application"}
          <ArrowRightIcon className="size-[1rem] transition-transform duration-300 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1 lg:size-5" />
        </button>
      </form>
    </>
  );
}
