import { CarouselImageType } from '@/CarouselType';
import mongoose, { Model } from 'mongoose';

interface ICarouselModel {
  page: string;
  position: string;
  images: CarouselImageType[];
}

const CarouselSchema = new mongoose.Schema({
  page: { type: String, required: true },
  position: { type: String, required: true },
  images: { type: Array<CarouselImageType>, required: true },
});

let CarouselModel: Model<ICarouselModel>;
try {
  CarouselModel = mongoose.model<ICarouselModel>('Carousel');
} catch {
  CarouselModel = mongoose.model<ICarouselModel>('Carousel', CarouselSchema);
}

export default CarouselModel;
