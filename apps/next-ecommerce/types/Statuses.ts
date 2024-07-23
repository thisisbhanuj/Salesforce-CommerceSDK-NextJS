export enum OrderStatus {
  Created = 'Created',
  Pending = 'Pending',
  Processing = 'Processing',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled',
}

export enum OrderMode {
  Online = 'Online',
  COD = 'COD',
  Subscription = 'Subscription',
}

export enum PaymentStatus {
  Paid = 'Paid',
  Unpaid = 'Unpaid',
}

export enum DeliveryStatus {
  Delivered = 'Delivered',
  Undelivered = 'Undelivered',
  Lost = 'Lost',
}
