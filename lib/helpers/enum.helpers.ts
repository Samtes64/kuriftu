import { TierName } from "@prisma/client";

export const pointMatches: Record<TierName, number> = {
  'Platinum': 300,
  'Gold': 200,
  'Silver': 100,
}

export const pointMapper: Record<TierName, number> = {
  'Platinum': .20,
  'Gold': .15,
  'Silver': .10,
}

export const tierPoints: Record<number, TierName> = {
  10000: 'Platinum',
  5000: 'Gold',
  2000: 'Silver',
}
