export type InventoryFormItem = {
  price: number | string;
  sale_price?: number | string;
  discount_price?: number | string;
  discount_start_date?: string;
  discount_end_date?: string;
  stock: number;
  quantity: number;
  active: boolean;
};

