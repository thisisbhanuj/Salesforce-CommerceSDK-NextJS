'use client';

import React from 'react';

type PageSelectorProps = {
  pageSelectHandler: (selectedPage: string) => void;
};

const PageSelector: React.FC<PageSelectorProps> = ({ pageSelectHandler }) => {
  const [selectedPage, setSelectedPage] = React.useState('');

  React.useEffect(() => {
    if (selectedPage) {
      pageSelectHandler(selectedPage);
    }
  }, [selectedPage]);

  return (
    <div className="page-selector grid min-h-screen items-center justify-center space-y-4">
      <AccordionList
        items={
          [
            { text: 'HOME' },
            { text: 'PDP' },
            { text: 'PLP' },
            { text: 'BLOG' },
            { text: 'TESTIMONIAL' },
          ] as { text: string }[]
        }
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
      />
    </div>
  );
};

function AccordionList({
  items,
  selectedPage,
  setSelectedPage,
}: {
  items: { text: string }[];
  selectedPage: string;
  setSelectedPage: (text: string) => void;
}) {
  return (
    <div className="">
      <div className="heading5 flex justify-center">Select Page</div>
      <ul
        id="items"
        className="grid min-h-screen items-center justify-center space-y-4"
      >
        {items.map((item: { text: string }, index) => (
          <li
            key={item.text}
            className={`accordian-item overflow-hidden rounded-lg transition-all duration-300 ease-in-out ${
              selectedPage === item.text ? 'bg-gray-200' : ''
            }`}
            onClick={() => setSelectedPage(item.text)}
          >
            <div className="cursor-pointer p-4">
              <p className="flex justify-center text-black">{item.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PageSelector;
