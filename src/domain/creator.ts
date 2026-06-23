// Core Domain Entities & Business Rules (Domain / Business Logic)

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export interface CreatorProfile {
  id: string;
  userId: string;
  followerCount: number;
  niche: string;
  country: string;
  language: string;
  createdAt: Date;
}

export interface CreatorDNA {
  id: string;
  creatorId: string;
  traitName: string;
  traitValue: string;
  confidenceScore: number;
  sampleSize: number;
  updatedAt: Date;
}

// Business Logic: Calculating raw virality potential or Creator matching
export function calculateDomainViralityScore(metrics: {
  views: number;
  likes: number;
  shares: number;
  saves: number;
  completionRate: number;
}): number {
  if (metrics.views === 0) return 0;
  
  // Weights based on viral short-form retention & sharing multipliers
  const shareWeight = 5.0;
  const saveWeight = 3.0;
  const likeWeight = 1.0;
  const completionWeight = 10.0;
  
  const interactionFactor = (metrics.likes * likeWeight + metrics.shares * shareWeight + metrics.saves * saveWeight) / metrics.views;
  const baseScore = (interactionFactor * 100) + (metrics.completionRate * completionWeight);
  
  // Bound between 0 and 100%
  return Math.min(100, Math.max(0, parseFloat(baseScore.toFixed(2))));
}
