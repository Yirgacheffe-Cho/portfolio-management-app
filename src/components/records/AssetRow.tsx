import { AssetInputCell } from './AssetInputCell';
import type { AssetRecord } from '@/types/asset';

type Props = {
  location: string;
  assetKeys: string[];
  records: AssetRecord[];
  date: string;
};

export function AssetRow({ location, assetKeys, records }: Props) {
  return (
    <tr className="border-t">
      <td className="font-medium px-2 py-1">{location}</td>
      {assetKeys.map((key) => {
        const [type, currency] = key.split('_');
        const record = records.find(
          (r) => r.type === type && r.currency === currency,
        );

        return (
          <td key={key} className="px-1 py-1">
            {record ? (
              <AssetInputCell
                amount={record.amount}
                location={location}
                type={record.type}
                currency={record.currency}
              />
            ) : (
              <div className="text-muted-foreground w-24 text-right pr-2">
                –
              </div>
            )}
          </td>
        );
      })}
    </tr>
  );
}
