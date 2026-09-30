"use client";

import { useEffect, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { ArrowRightIcon, ChevronRightIcon } from "@/components/ui/Icons";
import { FORMSUBMIT_ACTION, SITE_URL } from "@/lib/constants";
import { readApplication } from "./application";
import {
  EXPERIENCE_OPTIONS,
  LOCATION_OPTIONS,
  type ApplicationErrors,
  type ApplicationField,
} from "./options";

/** Query flag FormSubmit's `_next` redirect brings the visitor back with. */
const SENT_PARAM = "application";

function returnUrl(origin: string) {
  return `${origin}/?${SENT_PARAM}=sent#work-with-us`;
}

// Read once when the page loads (FormSubmit's redirect is a full page load),
// so the flag survives removing it from the address bar below.
const arrivedAfterSending =
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).get(SENT_PARAM) === "sent";

const noSubscription = () => () => {};

const labelClasses =
  "block text-[0.55rem] font-medium uppercase leading-none tracking-[0.3em] text-foreground/80 lg:text-[0.68rem]";

const controlClasses =
  "mt-[0.55rem] block w-full rounded-[0.4rem] border border-white/20 bg-[#0c0c0c]/85 px-[0.9rem] text-base text-foreground transition-colors duration-200 placeholder:text-foreground/35 hover:border-white/40 focus:border-primary focus:outline-none aria-[invalid=true]:border-[#ea4335] lg:mt-3 lg:px-5";

type FieldProps = {
  name: ApplicationField | "phone";
  label: string;
  error?: string;
  children: (props: {
    id: string;
    name: string;
    "aria-invalid": boolean;
    "aria-describedby"?: string;
  }) => ReactNode;
};

function Field({ name, label, error, children }: FieldProps) {
  const id = `work-with-us-${name}`;
  return (
    <div>
      <label htmlFor={id} className={labelClasses}>
        {label}
      </label>
      {children({
        id,
        name,
        "aria-invalid": Boolean(error),
        "aria-describedby": error ? `${id}-error` : undefined,
      })}
      {error ? (
        <p id={`${id}-error`} className="mt-[0.4rem] text-[0.75rem] text-[#f28b82] lg:text-[0.85rem]">
          {error}
        </p>
      ) : null}
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

export function WorkWithUsForm() {
  const [errors, setErrors] = useState<ApplicationErrors>({});
  const [sending, setSending] = useState(false);
  // FormSubmit sends the visitor back here once the application is delivered.
  // False on the server; the real value is picked up right after hydration.
  const sent = useSyncExternalStore(noSubscription, () => arrivedAfterSending, () => false);

  useEffect(() => {
    // Tidy the address bar so a refresh or shared link starts fresh.
    const url = new URL(window.location.href);
    if (url.searchParams.has(SENT_PARAM)) {
      url.searchParams.delete(SENT_PARAM);
      window.history.replaceState(window.history.state, "", url);
    }

    // Coming back from FormSubmit with the Back button restores this page
    // from the cache with the button still reading "Sending…".
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setSending(false);
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const data = new FormData(form);
    const { values, fieldErrors, firstError } = readApplication((name) => data.get(name));

    event.preventDefault();

    if (firstError) {
      setErrors(fieldErrors);
      form.querySelector<HTMLElement>(`[name="${firstError}"]`)?.focus();
      return;
    }

    // Valid: fill in the per-application fields and post the form to FormSubmit
    // right away. form.submit() reads the fields synchronously, before React
    // re-renders (a re-render resets hidden inputs to their default value).
    const hidden = (name: string) => form.elements.namedItem(name) as HTMLInputElement;
    hidden("_subject").value = `Work With Us: ${values.name} (${values.location})`;
    hidden("_next").value = returnUrl(window.location.origin);
    form.submit();
    setErrors({});
    setSending(true);
  }

  if (sent) {
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

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form
      action={FORMSUBMIT_ACTION}
      method="POST"
      onSubmit={handleSubmit}
      noValidate
      className="space-y-[1.15rem] lg:space-y-7"
    >
      {/* FormSubmit settings: table email, no captcha page, reply-to is the
          applicant (the "email" field), then back to this section. */}
      <input type="hidden" name="_subject" defaultValue="Work With Us application" />
      <input type="hidden" name="_template" defaultValue="table" />
      <input type="hidden" name="_captcha" defaultValue="false" />
      <input type="hidden" name="_next" defaultValue={returnUrl(SITE_URL)} />
      <div className="grid gap-[1.15rem] lg:grid-cols-2 lg:gap-7">
        <Field name="name" label="Name" error={errors.name}>
          {(props) => (
            <input {...props} type="text" autoComplete="name" required className={`${controlClasses} h-[2.9rem] lg:h-14`} />
          )}
        </Field>
        <Field name="email" label="Email" error={errors.email}>
          {(props) => (
            <input {...props} type="email" autoComplete="email" required className={`${controlClasses} h-[2.9rem] lg:h-14`} />
          )}
        </Field>
        <Field name="phone" label="Phone">
          {(props) => (
            <input {...props} type="tel" autoComplete="tel" className={`${controlClasses} h-[2.9rem] lg:h-14`} />
          )}
        </Field>
        <Field name="experience" label="Experience" error={errors.experience}>
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

      <Field name="location" label="Preferred location" error={errors.location}>
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

      <Field name="message" label="Message" error={errors.message}>
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

      {/* FormSubmit's honeypot: bots fill it and FormSubmit drops the entry.
          Hidden from people and assistive tech. */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="work-with-us-honey">Leave empty</label>
        <input id="work-with-us-honey" name="_honey" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {hasErrors ? (
        <p role="alert" className="text-[0.85rem] leading-[1.35] text-[#f28b82] lg:text-[0.95rem]">
          Please check the highlighted fields.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={sending}
        className="btn-sweep btn-sweep--invert-primary group flex h-[2.6rem] w-full items-center justify-center gap-[1.15rem] rounded-full border-[1.5px] border-primary bg-primary text-[0.72rem] font-medium uppercase tracking-[0.2em] text-white disabled:cursor-progress disabled:opacity-70 lg:h-14 lg:w-auto lg:gap-5 lg:px-12 lg:text-[0.85rem] lg:tracking-[0.24em]"
      >
        {sending ? "Sending…" : "Send application"}
        <ArrowRightIcon className="size-[1rem] transition-transform duration-300 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1 lg:size-5" />
      </button>
    </form>
  );
}
