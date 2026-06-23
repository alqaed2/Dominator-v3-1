import { User, CreatorProfile, CreatorDNA } from "../domain/creator.ts";

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: Omit<User, "id" | "createdAt">): Promise<User>;
}

export interface ICreatorProfileRepository {
  findById(id: string): Promise<CreatorProfile | null>;
  findByUserId(userId: string): Promise<CreatorProfile | null>;
  save(profile: Omit<CreatorProfile, "id" | "createdAt">): Promise<CreatorProfile>;
  getRankedCreators(niche: string, country: string): Promise<CreatorProfile[]>;
}

export interface ICreatorDNARepository {
  saveDNA(dna: Omit<CreatorDNA, "id" | "updatedAt">): Promise<CreatorDNA>;
  getDNAByCreatorId(creatorId: string): Promise<CreatorDNA[]>;
  getDNAByTrait(creatorId: string, traitName: string): Promise<CreatorDNA | null>;
}
