"use client";

import { Price, PriceValue } from "@/components/shared/price";

const PriceOnSaleExample = () => {
  return (
    <Price onSale={true}>
      <PriceValue price={100} currency="USD" />
    </Price>
  );
};

export default PriceOnSaleExample;
