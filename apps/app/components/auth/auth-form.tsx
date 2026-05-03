import { LanguageToggle } from "@/components/language-toggle";
import { useI18n } from "@/lib/i18n";
import { Button, Input, cn } from "@repo/ui";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Mail } from "lucide-react";
import type { ComponentProps, FormEvent } from "react";
import { GoogleLogin } from "./google-login";
import { OtpVerification } from "./otp-verification";
import { PasskeyLogin } from "./passkey-login";
import { useAuthForm } from "./use-auth-form";

const APP_NAME = import.meta.env.VITE_APP_NAME || "your account";

function SignupTerms() {
  const { t } = useI18n();

  return (
    <p className="text-xs text-muted-foreground text-center text-balance">
      {t("auth", "termsIntro")}{" "}
      <a
        href="/terms"
        className="underline underline-offset-4 hover:text-primary"
      >
        {t("auth", "terms")}
      </a>{" "}
      {t("auth", "and")}{" "}
      <a
        href="/privacy"
        className="underline underline-offset-4 hover:text-primary"
      >
        {t("auth", "privacy")}
      </a>
      .
    </p>
  );
}

interface AuthFormProps extends ComponentProps<"div"> {
  /**
   * UI mode affecting copy, ToS display, and available methods.
   * Both modes use the same passwordless OTP flow that auto-creates accounts.
   */
  mode?: "login" | "signup";
  /** Called after successful auth. Awaited before UI progresses. Caller handles cache invalidation and navigation. */
  onSuccess: () => Promise<void>;
  isLoading?: boolean;
  /** Post-auth redirect destination. Must be a safe relative path (validated by caller). */
  returnTo?: string;
}

export function AuthForm({
  className,
  onSuccess,
  isLoading,
  mode = "login",
  returnTo,
  ...props
}: AuthFormProps) {
  const { t } = useI18n();
  const {
    step,
    email,
    isDisabled,
    error,
    changeEmail,
    onAuthSuccess,
    setError,
    sendOtp,
    goToEmailStep,
    goToMethodStep,
    resetToEmail,
    setChildBusy,
    mode: formMode,
  } = useAuthForm({
    onSuccess,
    isExternallyLoading: isLoading,
    mode,
  });

  // Clear error when user changes email
  const handleEmailChange = (value: string) => {
    if (error) setError(null);
    changeEmail(value);
  };

  // Voluntary back from OTP clears error; forced back (via onCancel) preserves it
  const handleOtpBack = () => {
    setError(null);
    resetToEmail();
  };

  const isSignup = formMode === "signup";

  return (
    <div className={cn("flex flex-col gap-6 w-full", className)} {...props}>
      {/* Logo */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center">
        <span />
        <Link to="/" aria-label={t("auth", "goHome")}>
          <img src="/logo512.png" alt="" className="h-10 w-10" />
        </Link>
        <div className="justify-self-end">
          <LanguageToggle />
        </div>
      </div>

      {/* Error message - role="alert" ensures screen readers announce it */}
      {error && (
        <div
          role="alert"
          className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      {/* Step: Method Selection */}
      {step === "method" && (
        <MethodSelection
          isSignup={isSignup}
          isDisabled={isDisabled}
          onEmailClick={goToEmailStep}
          onSuccess={onAuthSuccess}
          onError={setError}
          onLoadingChange={setChildBusy}
          returnTo={returnTo}
        />
      )}

      {/* Step: Email Input */}
      {step === "email" && (
        <EmailInput
          email={email}
          isSignup={isSignup}
          isDisabled={isDisabled}
          onEmailChange={handleEmailChange}
          onSubmit={sendOtp}
          onBack={goToMethodStep}
        />
      )}

      {/* Step: OTP Verification */}
      {step === "otp" && (
        <OtpStep
          email={email}
          isDisabled={isDisabled}
          onSuccess={onAuthSuccess}
          onError={setError}
          onLoadingChange={setChildBusy}
          onBack={handleOtpBack}
          onCancel={resetToEmail}
        />
      )}
    </div>
  );
}

// Step 1: Method Selection
interface MethodSelectionProps {
  isSignup: boolean;
  isDisabled: boolean;
  onEmailClick: () => void;
  onSuccess: () => void;
  onError: (error: string | null) => void;
  onLoadingChange: (loading: boolean) => void;
  returnTo?: string;
}

function MethodSelection({
  isSignup,
  isDisabled,
  onEmailClick,
  onSuccess,
  onError,
  onLoadingChange,
  returnTo,
}: MethodSelectionProps) {
  const { format, t } = useI18n();
  const heading = isSignup
    ? t("auth", "createAccount")
    : format("auth", "loginTo", { appName: APP_NAME });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-center">{heading}</h1>

      <div className="flex flex-col gap-3">
        <GoogleLogin
          onError={onError}
          isDisabled={isDisabled}
          onLoadingChange={onLoadingChange}
          returnTo={returnTo}
        />

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onEmailClick}
          disabled={isDisabled}
        >
          <Mail className="mr-2 h-4 w-4" />
          {t("auth", "continueWithEmail")}
        </Button>

        {/* Passkey only available for login (requires existing account) */}
        {!isSignup && (
          <PasskeyLogin
            onSuccess={onSuccess}
            onError={onError}
            onLoadingChange={onLoadingChange}
            isDisabled={isDisabled}
          />
        )}
      </div>

      {isSignup && <SignupTerms />}

      {/* Account switch link */}
      <p className="text-sm text-muted-foreground text-center">
        {isSignup ? (
          <>
            {t("auth", "alreadyHaveAccount")}{" "}
            <Link
              to="/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {t("auth", "logIn")}
            </Link>
          </>
        ) : (
          <>
            {t("auth", "dontHaveAccount")}{" "}
            <Link
              to="/signup"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {t("auth", "signUp")}
            </Link>
          </>
        )}
      </p>
    </div>
  );
}

// Step 2: Email Input
interface EmailInputProps {
  email: string;
  isSignup: boolean;
  isDisabled: boolean;
  onEmailChange: (email: string) => void;
  onSubmit: (e?: FormEvent) => void;
  onBack: () => void;
}

function EmailInput({
  email,
  isSignup,
  isDisabled,
  onEmailChange,
  onSubmit,
  onBack,
}: EmailInputProps) {
  const { format, t } = useI18n();
  const target = isSignup ? t("auth", "signUp") : t("auth", "logIn");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-center">
        {t("auth", "emailQuestion")}
      </h1>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <Input
          type="email"
          placeholder={t("auth", "emailPlaceholder")}
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          disabled={isDisabled}
          autoComplete="email"
          autoFocus
          required
        />
        <Button
          type="submit"
          variant="default"
          className="w-full"
          disabled={isDisabled || !email.trim()}
        >
          {t("auth", "continueWithEmail")}
        </Button>
      </form>

      {isSignup && <SignupTerms />}

      {/* Back link */}
      <button
        type="button"
        onClick={onBack}
        disabled={isDisabled}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
      >
        <ArrowLeft className="h-4 w-4" />
        {format("auth", "backTo", { target })}
      </button>
    </div>
  );
}

// Step 3: OTP Verification
interface OtpStepProps {
  email: string;
  isDisabled: boolean;
  onSuccess: () => void;
  onError: (error: string | null) => void;
  onLoadingChange: (loading: boolean) => void;
  onBack: () => void;
  onCancel: () => void;
}

function OtpStep({
  email,
  isDisabled,
  onSuccess,
  onError,
  onLoadingChange,
  onBack,
  onCancel,
}: OtpStepProps) {
  const { format, t } = useI18n();

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{t("auth", "checkEmail")}</h1>
        <p className="text-muted-foreground mt-1">
          {format("auth", "sentCodeTo", { email })}
        </p>
      </div>

      <OtpVerification
        email={email}
        onSuccess={onSuccess}
        onError={onError}
        onLoadingChange={onLoadingChange}
        onCancel={onCancel}
        isDisabled={isDisabled}
      />

      {/* Back link */}
      <button
        type="button"
        onClick={onBack}
        disabled={isDisabled}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("auth", "backToEmail")}
      </button>
    </div>
  );
}
