import React from 'react';

const AfterPurchaseContent = () => {
  return (
    <div className="get-it mt-6 border-b border-line pb-8">
      <div className="heading5">Get it today</div>
      <div className="item mt-4 flex items-center gap-3">
        <div className="icon-delivery-truck text-4xl"></div>
        <div>
          <div className="text-title">Free shipping</div>
          <div className="caption1 mt-1 text-secondary">
            Free shipping on orders over USD 300.
          </div>
        </div>
      </div>
      <div className="item mt-4 flex items-center gap-3">
        <div className="icon-phone-call text-4xl"></div>
        <div>
          <div className="text-title">Support everyday</div>
          <div className="caption1 mt-1 text-secondary">
            Support from 8:30 AM to 5:00 PM MON-SAT
          </div>
        </div>
      </div>
      <div className="item mt-4 flex items-center gap-3">
        <div className="icon-return text-4xl"></div>
        <div>
          <div className="text-title">100 Day Returns</div>
          <div className="caption1 mt-1 text-secondary">
            Not impressed? Get a refund. You have 100 days to break our hearts.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AfterPurchaseContent;
