import { z } from 'zod';

export const brandSchema = z.object({
  brand_name: z.string(),
});

export type Brand = z.infer<typeof brandSchema>;

export const seasonSchema = z.object({
  season_name: z.coerce.number(),
});

export type Season = z.infer<typeof seasonSchema>;

export const productSchema = z.object({
  product_id: z.string(),
  product_name: z.string(),
  product_style: z.string(),
  product_color: z.string(),
  product_description: z.string(),
  image_url: z.string(),
  brand_name: z.string(),
  parent_type: z.string(),
});

export type Product = z.infer<typeof productSchema>;

export const imageSchema = z.object({
  style: z.string(),
  brand: z.string(),
  color: z.string(),
});

export type FetchImagesProps = z.infer<typeof imageSchema>;

export const image = z.object({
  url: z.string(),
});

export type Image = z.infer<typeof image>;

export const valueSchema = z.object({
  id: z.string(),
  name: z.string(),
  attribute: z.string(),
});

export type Value = z.infer<typeof valueSchema>;

export const attributeSchema = z.object({
  attribute_id: z.string(),
  attribute_name: z.string(),
  value_name: z.string(),
  status: z.boolean(),
  addAttribute: z.string(),
});

export type Attribute = z.infer<typeof attributeSchema>;

export const formSchema = z.object({
  brand_name: z.string().nonempty('Brand is required'),
  season_name: z.string().nonempty('Season is required'),
  parent_type: z.string().nonempty('Parent type is required'),
});

export type Form = z.infer<typeof formSchema>;

export const descriptionSchema = z.object({
  id: z.coerce.number(),
  locale: z.string(),
  label: z.string(),
  product_type: z.string(),
  product_description: z.string(),
  product_characteristic: z.string(),
  product_composition: z.string(),
  product_id: z.coerce.number(),
  status: z.boolean(),
});

export type Description = z.infer<typeof descriptionSchema>;
