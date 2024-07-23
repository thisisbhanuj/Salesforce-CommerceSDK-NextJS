import React, { useState, useEffect } from 'react';
import * as Icon from '@phosphor-icons/react/dist/ssr';

function DeliveryDateCalculator() {
  const [deliveryDate, setDeliveryDate] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  // Function to calculate estimated delivery dates (replace with your logic)
  const calculateDeliveryDates = () => {
    // Replace with your logic to determine delivery dates based on factors
    // such as product availability, shipping location, etc.
    // Example: Assume a lead time of 3-5 business days
    const today = new Date();
    const startDate = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000); // Add 3 business days
    const endDate = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000); // Add 5 business days
    setDeliveryDate({ startDate: startDate, endDate: endDate });
  };

  useEffect(() => {
    calculateDeliveryDates();
  }, []); // Empty dependency array to run only once on component mount

  const formattedStartDate = deliveryDate.startDate?.toLocaleDateString(
    'en-US',
    {
      day: 'numeric',
      month: 'long',
    },
  );
  const formattedEndDate = deliveryDate.endDate?.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="mt-3 flex items-center gap-1">
      <Icon.Timer className="body1" />
      <div className="text-title">Estimated Delivery:</div>
      <div className="text-secondary">
        {formattedStartDate} - {formattedEndDate}
      </div>
    </div>
  );
}

export default DeliveryDateCalculator;
