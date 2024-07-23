import mongoose, { Model, Schema } from 'mongoose';
import { DesignStateType } from '@/DesignStateType';

const pageDesignSchema: Schema<DesignStateType> = new Schema({
  name: { type: String, required: true },
  id: { type: String, required: true },
  componentPath: { type: String, required: true },
  sections: [
    {
      id: { type: String, required: false },
      order: { type: Number, required: false },
      componentPath: { type: String, required: false },
      type: { type: String, required: false },
      content: { type: [Schema.Types.Mixed], required: false },
      breakpoints: { type: [Schema.Types.Mixed], required: false },
      layout: {
        columns: { type: Number, required: false },
        rows: { type: Number, required: false },
        gap: { type: String, required: false },
      },
    },
  ],
  order: [{ type: String, required: false }],
});

let PageDesign: Model<DesignStateType>;
try {
  PageDesign = mongoose.model<DesignStateType>('PageDesign');
} catch {
  PageDesign = mongoose.model<DesignStateType>('PageDesign', pageDesignSchema);
}

export default PageDesign;
