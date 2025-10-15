import { z } from 'zod';

export const ProductsNotFoundSchema = z.string();

export const AttributeNotFoundList = z.string();

export const ValueNotFoundListSchema = z.object({
  attribute: z.string(),
  value: z.string(),
});



export type Product = z.infer<typeof ProductsNotFoundSchema>;
export type Attribute = z.infer<typeof AttributeNotFoundList>;
export type Value = z.infer<typeof ValueNotFoundListSchema>;


export const uploadSchema = z.object({
  attributeNotFoundList: z.array(AttributeNotFoundList),
  valueNotFoundList: z.array(ValueNotFoundListSchema),
  productNotFoundList: z.array(ProductsNotFoundSchema),
});

export type UploadListState = z.infer<typeof uploadSchema>;