import { auth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Button, Input } from "@repo/ui";
import type { FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";

const RESEND_COOLDOWN_SECONDS = 30;

// Better Auth email-otp plugin error codes (matches server-side ERROR_CODES)
const OTP_ERROR_CODES = {
  TOO_MANY_ATTEMPTS: "TOO_MANY_ATTEMPTS",
  OTP_EXPIRED: "OTP_EXPIRED",
  INVALID_OTP: "INVALID_OTP",
} as const;

interface OtpVerificationProps {
  email: string;
  onSuccess: () => void;
  onError: (error: string | null) => void;
  onLoadingChange?: (loading: boolean) => void;
  onCancel: () => void;
  isDisabled?: boolean;
}

export function OtpVerification({
  email,
  onSuccess,
  onError,
  onLoadingChange,
  onCancel,
  isDisabled,
}: OtpVerificationProps) {
  const { format, t } = useI18n();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const setLoading = useCallback(
    (loading: boolean) => {
      setIsLoading(loading);
      onLoadingChange?.(loading);
    },
    [onLoadingChange],
  );

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleOtpVerification = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!email || !otp) return;

    try {
      setLoading(true);
      onError(null);

      const result = await auth.signIn.emailOtp({
        email,
        otp,
      });

      if (result.data) {
        onSuccess();
      } else if (result.error) {
        const code = "code" in result.error ? result.error.code : undefined;
        if (code === OTP_ERROR_CODES.TOO_MANY_ATTEMPTS) {
          onError(t("auth", "tooManyAttempts"));
          onCancel();
        } else if (code === OTP_ERROR_CODES.OTP_EXPIRED) {
          onError(t("auth", "codeExpired"));
          onCancel();
        } else {
          onError(result.error.message || t("auth", "invalidCode"));
        }
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      onError(t("auth", "verifyFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;

    setOtp("");
    onError(null);

    try {
      setLoading(true);

      // "sign-in" type handles both login and signup (creates user if needed)
      const result = await auth.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });

      if (result.error) {
        onError(result.error.message || t("auth", "sendOtpFailed"));
      } else {
        setResendCooldown(RESEND_COOLDOWN_SECONDS);
      }
    } catch (err) {
      console.error("Email OTP error:", err);
      onError(t("auth", "sendCodeFailed"));
    } finally {
      setLoading(false);
    }
  };

  const disabled = isDisabled || isLoading;

  return (
    <form onSubmit={handleOtpVerification} className="flex flex-col gap-3">
      <Input
        type="text"
        placeholder={t("auth", "codePlaceholder")}
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
        disabled={disabled}
        autoComplete="one-time-code"
        required
        autoFocus
        maxLength={6}
        pattern="[0-9]{6}"
        inputMode="numeric"
        className="text-center text-lg tracking-widest"
      />
      <Button
        type="submit"
        variant="default"
        className="w-full"
        disabled={disabled || otp.length !== 6}
      >
        {t("auth", "verifyCode")}
      </Button>
      <Button
        type="button"
        variant="ghost"
        className="w-full text-sm"
        onClick={handleResendOtp}
        disabled={disabled || resendCooldown > 0}
      >
        {resendCooldown > 0
          ? format("auth", "resendCodeIn", { seconds: resendCooldown })
          : t("auth", "resendCode")}
      </Button>
    </form>
  );
}
