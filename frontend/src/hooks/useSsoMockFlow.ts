import { useCallback, useEffect, useState } from "react";

export type SsoMockStep = "step1" | "step2" | "step3" | "verified";

interface UseSsoMockFlowResult {
  step: SsoMockStep;
  advanceToStep2: () => void;
  advanceToStep3: () => void;
}

const STEP3_MIN_DELAY_MS = 3000;
const STEP3_MAX_DELAY_MS = 5000;

export function useSsoMockFlow(): UseSsoMockFlowResult {
  const [step, setStep] = useState<SsoMockStep>("step1");

  const advanceToStep2 = useCallback(() => setStep("step2"), []);
  const advanceToStep3 = useCallback(() => setStep("step3"), []);

  // Duo push simulation: auto-advances to "verified" after a random 3-5s delay,
  // cancellable via cleanup so a fast unmount/step change can't fire a stale advance.
  useEffect(() => {
    if (step !== "step3") return;

    const delay = STEP3_MIN_DELAY_MS + Math.random() * (STEP3_MAX_DELAY_MS - STEP3_MIN_DELAY_MS);
    const timer = setTimeout(() => setStep("verified"), delay);

    return () => clearTimeout(timer);
  }, [step]);

  return { step, advanceToStep2, advanceToStep3 };
}
