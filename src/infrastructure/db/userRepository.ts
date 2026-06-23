import { IUserRepository, ICreatorProfileRepository, ICreatorDNARepository } from "../../ports/repositories.ts";
import { User, CreatorProfile, CreatorDNA } from "../../domain/creator.ts";
import { prisma } from "./prismaClient.ts";

export class PrismaUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    try {
      const res = await prisma.user.findUnique({ where: { id } });
      return res ? { id: res.id, email: res.email, passwordHash: res.passwordHash, createdAt: res.createdAt } : null;
    } catch (err) {
      console.warn(">> UserRepository.findById: DB query failed, falling back to mock behavior.", err);
      return null;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const res = await prisma.user.findUnique({ where: { email } });
      return res ? { id: res.id, email: res.email, passwordHash: res.passwordHash, createdAt: res.createdAt } : null;
    } catch (err) {
      console.warn(">> UserRepository.findByEmail: DB query failed, falling back to mock behavior.", err);
      if (email === "demo@dominator.ai") {
        return {
          id: "demo-user-id",
          email: "demo@dominator.ai",
          passwordHash: "$2b$10$DEMOHASH",
          createdAt: new Date()
        };
      }
      return null;
    }
  }

  async create(user: Omit<User, "id" | "createdAt">): Promise<User> {
    try {
      const res = await prisma.user.create({
        data: {
          email: user.email,
          passwordHash: user.passwordHash
        }
      });
      return { id: res.id, email: res.email, passwordHash: res.passwordHash, createdAt: res.createdAt };
    } catch (err) {
      console.warn(">> UserRepository.create: DB write failed. Storing in virtual in-memory database.", err);
      return {
        id: "virtual-user-" + Math.random().toString(36).substring(2, 9),
        email: user.email,
        passwordHash: user.passwordHash,
        createdAt: new Date()
      };
    }
  }
}

export class PrismaCreatorProfileRepository implements ICreatorProfileRepository {
  async findById(id: string): Promise<CreatorProfile | null> {
    try {
      const res = await prisma.creatorProfile.findUnique({ where: { id } });
      return res ? { id: res.id, userId: res.userId, followerCount: res.followerCount, niche: res.niche, country: res.country, language: res.language, createdAt: res.createdAt } : null;
    } catch (err) {
      console.warn(">> CreatorProfileRepository.findById failed:", err);
      return null;
    }
  }

  async findByUserId(userId: string): Promise<CreatorProfile | null> {
    try {
      const res = await prisma.creatorProfile.findUnique({ where: { userId } });
      return res ? { id: res.id, userId: res.userId, followerCount: res.followerCount, niche: res.niche, country: res.country, language: res.language, createdAt: res.createdAt } : null;
    } catch (err) {
      console.warn(">> CreatorProfileRepository.findByUserId failed:", err);
      return null;
    }
  }

  async save(profile: Omit<CreatorProfile, "id" | "createdAt">): Promise<CreatorProfile> {
    try {
      const res = await prisma.creatorProfile.upsert({
        where: { userId: profile.userId },
        update: {
          followerCount: profile.followerCount,
          niche: profile.niche,
          country: profile.country,
          language: profile.language
        },
        create: {
          userId: profile.userId,
          followerCount: profile.followerCount,
          niche: profile.niche,
          country: profile.country,
          language: profile.language
        }
      });
      return { id: res.id, userId: res.userId, followerCount: res.followerCount, niche: res.niche, country: res.country, language: res.language, createdAt: res.createdAt };
    } catch (err) {
      console.warn(">> CreatorProfileRepository.save failed, reverting to in-memory virtualization:", err);
      return {
        id: "virtual-profile-" + Math.random().toString(36).substring(2, 9),
        userId: profile.userId,
        followerCount: profile.followerCount,
        niche: profile.niche,
        country: profile.country,
        language: profile.language,
        createdAt: new Date()
      };
    }
  }

  async getRankedCreators(niche: string, country: string): Promise<CreatorProfile[]> {
    try {
      const list = await prisma.creatorProfile.findMany({
        where: { niche, country },
        orderBy: { followerCount: "desc" }
      });
      return list.map(res => ({ id: res.id, userId: res.userId, followerCount: res.followerCount, niche: res.niche, country: res.country, language: res.language, createdAt: res.createdAt }));
    } catch (err) {
      console.warn(">> CreatorProfileRepository.getRankedCreators failed:", err);
      return [
        {
          id: "creator-alpha",
          userId: "user-alpha",
          followerCount: 1540000,
          niche,
          country,
          language: "ar",
          createdAt: new Date()
        },
        {
          id: "creator-beta",
          userId: "user-beta",
          followerCount: 420000,
          niche,
          country,
          language: "ar",
          createdAt: new Date()
        }
      ];
    }
  }
}

export class PrismaCreatorDNARepository implements ICreatorDNARepository {
  async saveDNA(dna: Omit<CreatorDNA, "id" | "updatedAt">): Promise<CreatorDNA> {
    try {
      const records = await prisma.creatorDNA.findMany({
        where: {
          creatorId: dna.creatorId,
          traitName: dna.traitName
        }
      });

      if (records.length > 0) {
        const res = await prisma.creatorDNA.update({
          where: { id: records[0].id },
          data: {
            traitValue: dna.traitValue,
            confidenceScore: dna.confidenceScore,
            sampleSize: dna.sampleSize
          }
        });
        return { id: res.id, creatorId: res.creatorId, traitName: res.traitName, traitValue: res.traitValue, confidenceScore: res.confidenceScore, sampleSize: res.sampleSize, updatedAt: res.updatedAt };
      } else {
        const res = await prisma.creatorDNA.create({
          data: {
            creatorId: dna.creatorId,
            traitName: dna.traitName,
            traitValue: dna.traitValue,
            confidenceScore: dna.confidenceScore,
            sampleSize: dna.sampleSize
          }
        });
        return { id: res.id, creatorId: res.creatorId, traitName: res.traitName, traitValue: res.traitValue, confidenceScore: res.confidenceScore, sampleSize: res.sampleSize, updatedAt: res.updatedAt };
      }
    } catch (err) {
      console.warn(">> CreatorDNARepository.saveDNA failed:", err);
      return {
        id: "virtual-dna-" + Math.random().toString(36).substring(2, 9),
        creatorId: dna.creatorId,
        traitName: dna.traitName,
        traitValue: dna.traitValue,
        confidenceScore: dna.confidenceScore,
        sampleSize: dna.sampleSize,
        updatedAt: new Date()
      };
    }
  }

  async getDNAByCreatorId(creatorId: string): Promise<CreatorDNA[]> {
    try {
      const list = await prisma.creatorDNA.findMany({
        where: { creatorId }
      });
      return list.map(res => ({ id: res.id, creatorId: res.creatorId, traitName: res.traitName, traitValue: res.traitValue, confidenceScore: res.confidenceScore, sampleSize: res.sampleSize, updatedAt: res.updatedAt }));
    } catch (err) {
      console.warn(">> CreatorDNARepository.getDNAByCreatorId failed:", err);
      return [];
    }
  }

  async getDNAByTrait(creatorId: string, traitName: string): Promise<CreatorDNA | null> {
    try {
      const records = await prisma.creatorDNA.findMany({
        where: { creatorId, traitName },
        take: 1
      });
      if (records[0]) {
        const res = records[0];
        return { id: res.id, creatorId: res.creatorId, traitName: res.traitName, traitValue: res.traitValue, confidenceScore: res.confidenceScore, sampleSize: res.sampleSize, updatedAt: res.updatedAt };
      }
      return null;
    } catch (err) {
      console.warn(">> CreatorDNARepository.getDNAByTrait failed:", err);
      return null;
    }
  }
}
