import { StaticImageData } from 'next/image';

export interface BaseComponentProps {
  id: string;
  [key: string]: any;
}

export interface TestimonialProps extends BaseComponentProps {
  limit: number;
}

export interface CarouselProps extends BaseComponentProps {
  sliderImages: {
    id: 1;
    promotionalMessage1: string;
    promotionalMessage2: string;
    template: string;
    sliderImage: string | StaticImageData;
  }[];
}
