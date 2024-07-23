/**
 * Represents an interactive div component.
 */
import React from 'react';

interface InteractiveDivProps {
  onClickHandler?: ((...args: any[]) => void) | (() => void);
  withEventClickHandler?: () => void;
  children?: React.ReactNode;
  className?: string;
}

/**
 * InteractiveDiv component.
 *
 * @param {InteractiveDivProps} props - The props.
 */
const InteractiveDiv: React.FC<InteractiveDivProps> = ({
  onClickHandler,
  withEventClickHandler,
  children,
  className,
}) => {
  /**
   * Handles the click event on the div element.
   *
   * @param {React.MouseEvent<HTMLDivElement>} event - The click event.
   */
  const handleClick = (...args: any[]) => {
    if (onClickHandler) {
      if (typeof onClickHandler === 'function') {
        onClickHandler(...args);
      }
    } else if (withEventClickHandler) {
      withEventClickHandler();
    } else {
      console.warn('InteractiveDiv: No click handler provided!');
    }
  };

  return (
    <div
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          handleClick();
        }
      }}
      role="button"
      tabIndex={0}
      className={className}
    >
      {children}
    </div>
  );
};

export default InteractiveDiv;
