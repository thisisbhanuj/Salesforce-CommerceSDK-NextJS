'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

import { findOrders } from '../../actions/order.actions';
import Footer from '../footer/Footer';
import HandlePagination from './HandlePagination';

interface OrderItem {
  id: string;
  orderId: string;
  commerceItems: {
    ID: string;
    name: string;
    color: string;
    size: string;
    quantity: number;
    image: string;
    price: number;
    isCustomized?: boolean;
  }[];
  shippingAddress: {
    fullName: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zipCode: string;
  };
  status: string;
  mode: string;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  orderDiscount: number;
  totalDiscount: number;
  finalOrderAmount: number;
  paid: boolean;
  delivered: boolean;
  deliveryDate: string;
  trackingNumber: string;
}

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const limit = 5;
  const pageCountRef = useRef(0);

  const handlePageChange = (selected: number) => {
    setCurrentPage(selected);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersSet = await findOrders(currentPage);
        if (!ordersSet) {
          console.error('No orders found');
          return;
        }

        const allOrdersJSON = JSON.parse(ordersSet);
        setTotalOrders(allOrdersJSON.total);
        setOrders(allOrdersJSON.ordersJSON);

        const pageCount = Math.ceil(allOrdersJSON.total / limit);
        pageCountRef.current = pageCount;
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    fetchOrders(); // Call the function on component mount
  }, [currentPage]); // Update effect when currentPage changes

  return (
    <>
      <div className="container">
        <div className="list-orders-block relative grid-cols-1 px-2 py-5">
          <div className="list-orders mt-2 flex items-center gap-3">
            <div className="total-orders">
              {totalOrders}
              <span className="pl-1 text-secondary">Order(s) Found</span>
            </div>
          </div>

          <div className={`mt-3 gap-[20px] sm:gap-[30px]`}>
            <ul>
              {orders.map((order: OrderItem) => {
                return (
                  <li key={order.orderId}>
                    <div
                      key={order.orderId}
                      className="list-orders bg-gray-100 mb-4 mt-5 flex flex-shrink-0 rounded p-4 shadow sm:mt-7"
                    >
                      <div className="w-full">
                        <div className="total-orders">
                          <span className="pl-1 text-secondary"># </span>
                          {order.orderId}
                        </div>
                        <div className="order-status">
                          <span className="pl-1 text-secondary">Status: </span>
                          {order.status}
                        </div>
                        <div className="order-mode">
                          <span className="pl-1 text-secondary">
                            Payment Mode:{' '}
                          </span>
                          {order.mode}
                        </div>
                        <hr className="border-gray-100 mb-1 mt-1 border" />

                        <div className="flex">
                          <div className="w-1/2">
                            <div className="text-button text-center">
                              Product
                            </div>
                          </div>
                          <div className="w-1/6">
                            <div className="text-button text-wrap text-center">
                              Price
                            </div>
                          </div>
                          <div className="w-1/6">
                            <div className="text-button text-center">Qty</div>
                          </div>
                          <div className="w-1/3">
                            <div className="text-button text-center">
                              Tracking #
                            </div>
                          </div>
                        </div>

                        <div className="list-orders flex-col">
                          <ul>
                            {order?.commerceItems?.map((product, index) => (
                              <li key={`${product.ID}-${product.color}`}>
                                <div className="mt-5 flex flex-shrink-0 sm:mt-7">
                                  <div className="w-1/2">
                                    <div className="flex items-center gap-3">
                                      <div className="product-img">
                                        <Image
                                          src={product.image}
                                          alt={product.name}
                                          width={50}
                                          height={50}
                                        />
                                      </div>
                                      <div className="product-name">
                                        <div className="text-button text-center">
                                          {product.name}
                                        </div>
                                        <div className="text-button text-center text-xs text-secondary">
                                          {product.color} | {product.size}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="w-1/6">
                                    <div className="text-button text-center">
                                      ${product.price}
                                    </div>
                                  </div>
                                  <div className="w-1/6">
                                    <div className="text-button text-center">
                                      {product.quantity}
                                    </div>
                                  </div>
                                  <div className="w-1/3">
                                    <div className="text-button text-center text-xs">
                                      {order?.trackingNumber ?? ''}
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <hr className="border-gray-10 mt-2 border" />

                        <div className="mt-2 flex">
                          <div className="w-1/2">
                            <div className="text-button text-center">
                              Shipping Address
                            </div>
                            <div className="text-button mt-2 text-center text-xs">
                              {order.shippingAddress?.address1},{' '}
                              {order.shippingAddress?.address2},{' '}
                              {order.shippingAddress?.city},{' '}
                              {order.shippingAddress?.state},{' '}
                              {order.shippingAddress?.zipCode}
                            </div>
                          </div>
                          <div className="w-1/3">
                            <div className="text-button text-center">
                              Delivered On
                            </div>
                            <div className="text-button text-center">
                              {order.deliveryDate ?? 'Pending'}
                            </div>
                          </div>
                          <div className="w-1/6">
                            <div className="text-button text-center">Total</div>
                            <div className="text-button text-center">
                              ${order.finalOrderAmount}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          {pageCountRef.current > 1 && (
            <div className="list-pagination mt-7 flex justify-center md:mt-10">
              <HandlePagination
                pageCount={pageCountRef.current}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrdersList;
