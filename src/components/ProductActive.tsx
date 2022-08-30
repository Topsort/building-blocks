import { h, FunctionalComponent } from "preact";

export const ProductActive: FunctionalComponent<{
  campaignId: string;
  activeBids: number;
}> = ({ campaignId, activeBids }) => {
  return (
    <div>
      <span>Product: {campaignId}</span>
      <span>Nº Products: {activeBids}</span>
    </div>
  );
};
