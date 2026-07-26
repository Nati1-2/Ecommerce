export interface ICartItem {
  productId: string;
  vendorId?: string;
  productName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  subtotal: number;
}

export interface ICart {
  ownerId: string; // userId or guestId
  items: ICartItem[];
  totalItems: number;
  totalAmount: number;
  updatedAt: string;
}
