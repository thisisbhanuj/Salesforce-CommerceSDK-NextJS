import React from 'react';

import * as Icon from '@phosphor-icons/react/dist/ssr';

interface ContentProps {
  message: string;
  customClass?: string;
}

const PopoverNotiifcation: React.FC<ContentProps> = ({
  message,
  customClass,
}) => {
  return (
    <div
      className={`popover-content mt-2 items-center justify-center ${customClass}`}
    >
      <p className="text-gray-700 flex gap-2 text-nowrap capitalize">
        {message} <Icon.X size={15} className="popover-close cursor-pointer" />
      </p>
    </div>
  );
};

export default PopoverNotiifcation;
