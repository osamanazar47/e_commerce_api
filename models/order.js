import { Schema, model } from 'mongoose';

const orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1, // To ensure quantity is at least 1
      },
    },
  ],
  totalAmount: {
    type: Number,
    default: 0,
  },
});

const Order = model('Order', orderSchema);

export default Order;
