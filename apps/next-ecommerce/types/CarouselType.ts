import { StaticImageData } from 'next/image';

export type CarouselImageType = {
  id: number;
  promotionalMessage1: string;
  promotionalMessage2: string;
  url: string;
  sliderImage: string | StaticImageData;
};
