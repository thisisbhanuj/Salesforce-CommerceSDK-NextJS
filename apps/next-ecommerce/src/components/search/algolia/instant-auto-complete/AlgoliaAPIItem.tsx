'use client';

import Image from 'next/image';

export function AlgoliaAPIItem({
  hit,
  components,
}: {
  hit: {
    images: string[];
    name: string;
    color: string;
  };
  components: any;
}) {
  return (
    <div className="aa-ItemWrapper">
      <div className="aa-ItemContent">
        <div className="aa-ItemIcon aa-ItemIcon--alignTop">
          <Image src={hit.images[0]} alt={hit.name} width="60" height="60" />
        </div>
        <div className="aa-ItemContentBody">
          <div className="aa-ItemContentTitle uppercase">
            <components.Highlight hit={hit} attribute="name" />
          </div>
          <div className="aa-ItemContentDescription">
            <components.Highlight hit={hit} attribute="color" />
          </div>
        </div>
        <div className="aa-ItemActions"></div>
      </div>
    </div>
  );
}
