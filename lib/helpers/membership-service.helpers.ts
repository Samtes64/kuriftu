import { TierName } from "@prisma/client";

export function getMembershipName(points: number): TierName | null {
  if (points >= 10000) return 'Platinum';
  if (points >= 5000) return 'Gold';
  if (points >= 2000) return 'Silver';

  return null;
}
