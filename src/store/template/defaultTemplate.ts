// store/template/defaultTemplate.ts
import { AssetType, InvestmentType } from '@/types/asset';
import type { TemplateMeta } from './templateAtom';

export const defaultTemplate: TemplateMeta = {
  savingsGoal: 1000000,
  savingRate: 0.75,
  targetAllocation: {
    [AssetType.CASH]: 25 / 100,
    [AssetType.STOCK]: 25 / 100,
    [AssetType.GOLD]: 25 / 100,
    [AssetType.COIN]: 25 / 100,
  },
  investments: {
    우리은행: [
      {
        type: InvestmentType.KRW,
        currency: 'KRW',
      },
    ],
  },
};
