// store/template/defaultTemplate.ts
import { AssetType } from '@/types/asset';
import type { TemplateMeta } from './templateAtom';

export const defaultTemplate: TemplateMeta = {
  savingsGoal: 0,
  savingRate: 0.75,
  targetAllocation: {
    [AssetType.CASH]: 25 / 100,
    [AssetType.STOCK]: 25 / 100,
    [AssetType.GOLD]: 25 / 100,
    [AssetType.COIN]: 25 / 100,
  },
  locations: [],
  investments: {},
};
