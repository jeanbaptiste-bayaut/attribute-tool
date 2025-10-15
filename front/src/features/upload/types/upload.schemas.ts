import { z } from 'zod';

export const valuesSchema = z.object({
      attribute_id: z.string(),
      attribute_name: z.string(),
      value_name: z.string(),
    });

export const attributeSchema = z.string();

export const NotFoundSchema = z.object({
      attribute: z.string(),
      value: z.string(),
    });



export type Value = z.infer<typeof valuesSchema>;
export type Attribute = z.infer<typeof attributeSchema>;
export type NotFound = z.infer<typeof NotFoundSchema>;


export const uploadSchema = z.object({
  noExistingAttributes: z.array(attributeSchema),
  attributeNotFoundList: z.array(NotFoundSchema),
});

export type UploadListState = z.infer<typeof uploadSchema>;