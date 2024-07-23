import React from 'react';

interface RadioButtonProps {
  label: string;
  value: string;
  name: string; // Group name for radio buttons
  isChecked?: boolean; // Optional prop for initial selection
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isHidden?: boolean;
  selectedBgColor?: string;
}

const DecoratedRadioButton: React.FC<RadioButtonProps> = ({
  label,
  value,
  name,
  isChecked = false,
  onChange,
  isHidden = true,
  selectedBgColor,
}) => {
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event);
    const radioButton = event.target as HTMLInputElement;
    radioButton.className = selectedBgColor
      ? 'selected'
      : radioButton.className.replace(/\bselected\s*/g, '');
  };

  return (
    <label
      className={`glassmorphism mb-2 flex cursor-pointer px-6 py-4 font-bold transition-all`}
      style={{ backgroundColor: selectedBgColor }}
    >
      <input
        type="radio"
        id={value}
        name={name}
        value={value}
        checked={isChecked}
        onChange={handleRadioChange}
        className={`${isChecked ? 'selected' : ''} ${isHidden ? 'hidden' : 'mr-2'}`}
      />
      <span>{label}</span>
    </label>
  );
};

DecoratedRadioButton.displayName = 'Accordian';

export default DecoratedRadioButton;
