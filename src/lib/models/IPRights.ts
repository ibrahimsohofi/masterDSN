import { z } from "zod";

export const IPRightsSchema = z.object({
  id: z.string(),
  submissionId: z.string(),
  userId: z.string(),
  rightsType: z.enum(["copyright", "patent", "trademark", "trade_secret"]),
  status: z.enum(["pending", "approved", "rejected"]),
  registrationNumber: z.string().optional(),
  filingDate: z.date(),
  expirationDate: z.date().optional(),
  jurisdiction: z.string(),
  description: z.string(),
  restrictions: z.array(z.string()),
  licensingTerms: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type IPRights = z.infer<typeof IPRightsSchema>;

export const IPUsageLogSchema = z.object({
  id: z.string(),
  ipRightsId: z.string(),
  userId: z.string(),
  accessType: z.enum(["view", "download", "share", "modify"]),
  timestamp: z.date(),
  purpose: z.string(),
  approved: z.boolean(),
  ipAddress: z.string(),
  userAgent: z.string(),
});

export type IPUsageLog = z.infer<typeof IPUsageLogSchema>;

export const WatermarkSchema = z.object({
  id: z.string(),
  ipRightsId: z.string(),
  type: z.enum(["visible", "invisible"]),
  content: z.string(),
  position: z.enum([
    "center",
    "topLeft",
    "topRight",
    "bottomLeft",
    "bottomRight",
  ]),
  opacity: z.number().min(0).max(1),
});

export type Watermark = z.infer<typeof WatermarkSchema>;
