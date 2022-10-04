import { z } from "zod";

export const nullSchema = z.null();

export const validateVendorSchema = z.object({
  authToken: z.string().min(1),
});

export const campaignIdsByProductIdSchema = z.record(
  z.string().min(1),
  z.string().uuid().nullable()
);

export const paymentMethodSchema = z.object({
  id: z.string().min(1),
  provider: z.string().min(1),
  data: z.object({
    id: z.string().min(1),
    type: z.string().min(1),
    brand: z.string().min(1),
    last4: z.string().length(4),
  }),
});

export const paymentMethodsSchema = z.object({
  methods: z.array(paymentMethodSchema),
});
