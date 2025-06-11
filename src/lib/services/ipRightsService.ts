import type { IPRights, IPUsageLog, Watermark } from "../models/IPRights";
import { createHash } from "crypto";
import { prisma } from "../db";
import { CustomError } from "../utils/errors";

export class IPRightsService {
  async createIPRights(data: Omit<IPRights, "id" | "createdAt" | "updatedAt">) {
    try {
      return await prisma.iPRights.create({
        data: {
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      throw new CustomError("Failed to create IP rights", { cause: error });
    }
  }

  async updateIPRights(id: string, data: Partial<IPRights>) {
    try {
      return await prisma.iPRights.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      throw new CustomError("Failed to update IP rights", { cause: error });
    }
  }

  async logUsage(data: Omit<IPUsageLog, "id" | "timestamp">) {
    try {
      return await prisma.iPUsageLog.create({
        data: {
          ...data,
          timestamp: new Date(),
        },
      });
    } catch (error) {
      throw new CustomError("Failed to log IP usage", { cause: error });
    }
  }

  async checkAccess(
    ipRightsId: string,
    userId: string,
    accessType: IPUsageLog["accessType"],
  ) {
    try {
      const ipRights = (await prisma.iPRights.findUnique({
        where: { id: ipRightsId },
      })) as unknown as IPRights;

      if (!ipRights) {
        throw new CustomError("IP Rights not found");
      }

      const hasPermission = await this.validatePermission(
        ipRights,
        userId,
        accessType,
      );

      if (!hasPermission) {
        throw new CustomError("Access denied");
      }

      return true;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError("Failed to check access", { cause: error });
    }
  }

  private async validatePermission(
    ipRights: IPRights,
    userId: string,
    accessType: IPUsageLog["accessType"],
  ): Promise<boolean> {
    // Owner always has access
    if (ipRights.userId === userId) return true;

    // Check status
    if (ipRights.status !== "approved") return false;

    // Check restrictions
    if (ipRights.restrictions.includes(`no_${accessType}`)) return false;

    try {
      // Check if user has been granted access through licensing
      const hasLicense = await prisma.iPLicense.findFirst({
        where: {
          ipRightsId: ipRights.id,
          userId,
          active: true,
          expirationDate: {
            gt: new Date(),
          },
        },
      });

      return !!hasLicense;
    } catch (error) {
      throw new CustomError("Failed to validate permission", { cause: error });
    }
  }

  async createWatermark(data: Omit<Watermark, "id">) {
    try {
      return await prisma.watermark.create({
        data,
      });
    } catch (error) {
      throw new CustomError("Failed to create watermark", { cause: error });
    }
  }

  async applyWatermark(
    fileBuffer: Buffer,
    watermark: Watermark,
  ): Promise<Buffer> {
    throw new CustomError("Watermark functionality not implemented");
  }

  private async applyVisibleWatermark(
    fileBuffer: Buffer,
    watermark: Watermark,
  ): Promise<Buffer> {
    throw new CustomError("Visible watermark functionality not implemented");
  }

  private async applyInvisibleWatermark(
    fileBuffer: Buffer,
    watermark: Watermark,
  ): Promise<Buffer> {
    throw new CustomError("Invisible watermark functionality not implemented");
  }

  async verifyWatermark(
    fileBuffer: Buffer,
    watermark: Watermark,
  ): Promise<boolean> {
    throw new CustomError("Watermark verification not implemented");
  }

  private async verifyVisibleWatermark(
    fileBuffer: Buffer,
    watermark: Watermark,
  ): Promise<boolean> {
    throw new CustomError("Visible watermark verification not implemented");
  }

  private async verifyInvisibleWatermark(
    fileBuffer: Buffer,
    watermark: Watermark,
  ): Promise<boolean> {
    throw new CustomError("Invisible watermark verification not implemented");
  }

  async generateDigitalSignature(fileBuffer: Buffer): Promise<string> {
    try {
      return createHash("sha256").update(fileBuffer).digest("hex");
    } catch (error) {
      throw new CustomError("Failed to generate digital signature", {
        cause: error,
      });
    }
  }
}
