import type { ReactNode } from "react";
import { Button } from "../../ui/button";

export interface Step {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  content: ReactNode;
}

interface MultiStepFormProps {
  steps: Step[];
  currentStep: number;
  isSubmitting?: boolean;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
}

export default function MultiStepForm({
  steps,
  currentStep,
  isSubmitting = false,
  onNext,
  onBack,
  onSubmit,
}: MultiStepFormProps) {
  return (
    <div>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Stepper */}
      <div className="flex justify-between mb-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                  isActive
                    ? "bg-green-500 text-white shadow-lg"
                    : isCompleted
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`text-xs font-medium text-center ${
                  isActive || isCompleted
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                {step.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl shadow-md p-8">
        {steps[currentStep].content}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={currentStep === 0}
          >
            ← Back
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button onClick={onNext}>Next Step →</Button>
          ) : (
            <Button onClick={onSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
