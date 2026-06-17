import { Check, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/helpers';

export interface StepItem {
  id: string;
  label: string;
  description?: string;
}

interface StepProgressProps {
  steps: StepItem[];
  currentStep: number;
  onStepClick?: (index: number) => void;
  variant?: 'horizontal' | 'vertical';
}

export default function StepProgress({
  steps,
  currentStep,
  onStepClick,
  variant = 'horizontal',
}: StepProgressProps) {
  if (variant === 'vertical') {
    return (
      <div className="space-y-1">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isClickable = onStepClick && (isCompleted || isCurrent);

          return (
            <div key={step.id} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all',
                    isCompleted && 'bg-green-500 text-white',
                    isCurrent && 'bg-blue-500 text-white ring-4 ring-blue-100',
                    !isCompleted && !isCurrent && 'bg-gray-200 text-gray-500',
                    isClickable && 'cursor-pointer hover:scale-105'
                  )}
                  onClick={() => isClickable && onStepClick(index)}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'w-0.5 flex-1 min-h-8 transition-colors',
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    )}
                  />
                )}
              </div>
              <div className="pb-6">
                <p
                  className={cn(
                    'font-medium',
                    isCurrent ? 'text-blue-600' : 'text-gray-900',
                    !isCompleted && !isCurrent && 'text-gray-500'
                  )}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isClickable = onStepClick && (isCompleted || isCurrent);

        return (
          <div key={step.id} className="flex-1 flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all',
                  isCompleted && 'bg-green-500 text-white',
                  isCurrent && 'bg-blue-500 text-white ring-4 ring-blue-100',
                  !isCompleted && !isCurrent && 'bg-gray-200 text-gray-500',
                  isClickable && 'cursor-pointer hover:scale-105'
                )}
                onClick={() => isClickable && onStepClick(index)}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <p
                className={cn(
                  'mt-2 text-sm font-medium',
                  isCurrent ? 'text-blue-600' : 'text-gray-600',
                  !isCompleted && !isCurrent && 'text-gray-400'
                )}
              >
                {step.label}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4 flex items-center">
                <div
                  className={cn(
                    'h-1 w-full rounded-full transition-colors',
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  )}
                >
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      isCurrent && 'bg-blue-500 w-1/2'
                    )}
                  />
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 -ml-2" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
