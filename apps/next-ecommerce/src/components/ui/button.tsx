import * as React from 'react';
import { useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { BeatLoader } from 'react-spinners';

/**
 * Button component.
 * 
 * @remarks
 * The `Button` component is a customizable button element that can be used in React applications.
 * It accepts all the standard HTML button attributes and can be styled using the `className` prop.
 * 
 * @param props - The props for the Button component.
 * @param ref - Direct DOM Access: If you ever need to access the 
 *              underlying DOM element of the button from a parent component 
 *              (e.g., for focusing the button programmatically), 
 *              you can use the ref forwarded by the Button component.
 * 
 * Usage:
 * ################
 *  <Button type="button" onClick={handleButtonClick}>Custom Button</Button>
 *    The component has type="button" to prevent form submission when clicked. 
 *    Its onClick handler executes the handleButtonClick function.
 *   
 * <Button type="submit">Submit Form</Button>
 *    The component has type="submit", 
 *    acting as a standard submit button that triggers form submission.
 * 
 * Accessing Ref:
 * ################
 * function MyForm() {
 *  const buttonRef = React.createRef();
 *
 *  const focusButton = () => {
 *    if (buttonRef.current) {
 *     buttonRef.current.focus(); // Accessing the DOM element using the forwarded ref
 *   }
 * };

 * return (
 *  <div>
 *     <Button ref={buttonRef} type="button">Focus Me</Button>
 *     <button onClick={focusButton}>Focus Button Programmatically</button>
 *   </div>
 * );
 * }
 *
 */

/**
 * Props for the Button component.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ ...props }, ref) => {
    const { pending } = useFormStatus();

    useEffect(() => {
      if (
        !props.loading &&
        ref &&
        (ref as React.MutableRefObject<HTMLButtonElement>).current
      ) {
        (ref as React.MutableRefObject<HTMLButtonElement>).current.focus();
      }
    }, [props.loading, ref]);

    return (
      <button
        ref={ref}
        {...props}
        disabled={pending}
        className={`button-main ${props.className}`}
        aria-disabled={props.loading ? true : undefined}
      >
        {props.loading ? <BeatLoader color="#36d7b7" size={8} /> : props.label}
      </button>
    );
  },
);

Button.displayName = 'Button';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  type: 'button' | 'submit' | 'reset' | undefined;
  label: string;
  loading?: boolean;
}

export default Button;
