
import React from "react";
import { Check } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
  const isMobile = useIsMobile();

  return (
    <div className="w-full py-4">
      <div className="flex justify-between relative">
        {/* Progress bar */}
        <div className="absolute top-1/2 left-0 h-1 bg-gray-200 w-full -translate-y-1/2 z-0"></div>
        <div
          className="absolute top-1/2 left-0 h-1 bg-aus-green transition-all z-0"
          style={{
            width: `${(Math.max(0, currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        ></div>

        {/* Step circles */}
        {steps.map((step, index) => {
          const isActive = index + 1 === currentStep;
          const isCompleted = index + 1 < currentStep;

          return (
            <div
              key={`step-${index}`}
              className="flex flex-col items-center relative z-10"
            >
              <div
                className={`flex items-center justify-center ${
                  isMobile ? "w-8 h-8" : "w-10 h-10"
                } rounded-full border-2 transition-all ${
                  isActive
                    ? "step-active"
                    : isCompleted
                    ? "step-completed"
                    : "step-inactive"
                }`}
              >
                {isCompleted ? (
                  <Check className={`${isMobile ? "h-4 w-4" : "h-5 w-5"}`} />
                ) : (
                  <span className={isMobile ? "text-sm" : ""}>{index + 1}</span>
                )}
              </div>
              <span
                className={`mt-2 ${
                  isMobile
                    ? "text-[10px] max-w-[60px]"
                    : "text-xs"
                } text-center transition-colors ${
                  isActive || isCompleted
                    ? "text-aus-green font-medium"
                    : "text-gray-500"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;

