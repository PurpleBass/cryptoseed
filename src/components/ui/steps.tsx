
import React, { createContext, useContext } from 'react';
import { cn } from '@/lib/utils';

// Create context for the Steps component
const StepsContext = createContext<{ isVertical: boolean }>({
  isVertical: true
});

interface StepsProps extends React.HTMLAttributes<HTMLDivElement> {
  vertical?: boolean;
}

/**
 * Steps Component
 * 
 * A component for displaying step-by-step instructions with customizable layout.
 * 
 * @param {StepsProps} props - Component props
 * @param {boolean} props.vertical - Whether to display steps vertically (default) or horizontally
 * @returns {JSX.Element} Steps container component
 */
const Steps = ({ vertical = true, className, children, ...props }: StepsProps) => {
  return (
    <StepsContext.Provider value={{ isVertical: vertical }}>
      <div 
        className={cn(
          "steps",
          vertical ? "flex flex-col gap-2" : "flex justify-between",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </StepsContext.Provider>
  );
};

/**
 * Step Component
 * 
 * Individual step component to be used within the Steps container.
 * 
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Component props
 * @returns {JSX.Element} Step component
 */
const Step = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const { isVertical } = useContext(StepsContext);
  
  return (
    <div 
      className={cn(
        "step",
        isVertical 
          ? "border-l pl-4 border-l-muted pb-4 last:pb-0 relative" 
          : "flex-1 px-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * StepNumber Component
 * 
 * Optional number indicator for a step.
 * 
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Component props
 * @returns {JSX.Element} Step number indicator
 */
const StepNumber = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const { isVertical } = useContext(StepsContext);
  
  return (
    <div 
      className={cn(
        "step-number",
        isVertical 
          ? "absolute -left-[21px] -mt-0.5 flex items-center justify-center w-10 h-10" 
          : "mb-2 flex items-center justify-center",
        className
      )}
      {...props}
    >
      <div className="w-6 h-6 rounded-full bg-secure-600 text-white flex items-center justify-center text-sm font-medium">
        {children}
      </div>
    </div>
  );
};

/**
 * StepTitle Component
 * 
 * Title for a step.
 * 
 * @param {React.HTMLAttributes<HTMLHeadingElement>} props - Component props
 * @returns {JSX.Element} Step title
 */
const StepTitle = ({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h4 
      className={cn(
        "step-title text-sm font-medium mb-1",
        className
      )}
      {...props}
    >
      {children}
    </h4>
  );
};

/**
 * StepDescription Component
 * 
 * Description text for a step.
 * 
 * @param {React.HTMLAttributes<HTMLParagraphElement>} props - Component props
 * @returns {JSX.Element} Step description
 */
const StepDescription = ({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
  return (
    <p 
      className={cn(
        "step-description text-xs text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
};

// Attach sub-components to main component
Steps.Step = Step;
Steps.StepNumber = StepNumber;
Steps.StepTitle = StepTitle;
Steps.StepDescription = StepDescription;

export { Steps };
