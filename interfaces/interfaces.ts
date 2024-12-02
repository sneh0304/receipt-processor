interface IReceiptItem {
    shortDescription: string;
    price: string;
}

export interface IReceipt {
    retailer: string;
    purchaseDate: string;
    purchaseTime: string;
    total: string;
    items: IReceiptItem[];
}