// @ts-nocheck
'use client';

import React, { useState } from 'react';

import { ShippingAddressType } from '../../../../types/CheckoutType';
import Button from '@/components/ui/button';
import toast, { Toaster } from 'react-hot-toast';
import DecoratedRadioButton from '@/components/ui/radioButton';
import { addNewProfileAddressAction } from '@/actions/user.actions';

interface Props {
  setSection: (section: string) => void;
  shippingAddressModel: ShippingAddressType[];
  setSelectedAddress: (address: string) => void;
  setFetchAddress: (fetchAddress: boolean) => void;
  isAddressSelected: boolean;
  selectedAddress: string;
}

const ShippingForm: React.FC<Props> = ({
  setSection,
  shippingAddressModel,
  setSelectedAddress,
  setFetchAddress,
  isAddressSelected,
  selectedAddress,
}) => {
  const [formData, setFormData] = useState<ShippingAddressType>();
  const [showNewAddressForm, setShowNewAddressForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleAddNewAddressSubmit = async (formData: FormData) => {
    setIsLoading(true);
    if (formData) {
      const res = await addNewProfileAddressAction(formData);
      if (res?.success) {
        toast.success(res?.message);
        setFetchAddress(true);
        setShowNewAddressForm(false);
      }
    }
  };

  return (
    <>
      <div className="information mt-5">
        {shippingAddressModel.length > 0 ? (
          <>
            <div className="heading5">Shipping Address</div>
            <div className="form-checkout mt-5">
              {!showNewAddressForm && (
                <form>
                  {shippingAddressModel.map((address, index) => (
                    <div className="flex flex-col" key={address.id}>
                      <DecoratedRadioButton
                        key={address.id}
                        label={
                          address.address_line_1 +
                          ', ' +
                          address.city +
                          ', ' +
                          address.state +
                          ' ' +
                          address.postCode +
                          ' - ' +
                          address.mobile
                        }
                        value={address.id ?? ''}
                        name="address" // Ensure all radio buttons have the same name for group behavior
                        isHidden={false}
                        onChange={(e) => {
                          setSelectedAddress(e.target.value);
                        }}
                        isChecked={address.id === selectedAddress}
                      />
                    </div>
                  ))}
                </form>
              )}
              <div className="block-button mt-6 lg:mt-10">
                {!showNewAddressForm && (
                  <Button
                    type="button"
                    onClick={() => {
                      isAddressSelected
                        ? setSection('Payment')
                        : setSection('Shipping');
                      if (!isAddressSelected) {
                        toast.error('Please select an address to proceed');
                      }
                    }}
                    label="Add Payment"
                    className="button-main ml-3 mr-8"
                  ></Button>
                )}
                {!showNewAddressForm ? (
                  <Button
                    type="button"
                    onClick={() => {
                      setSection('Shipping');
                      setShowNewAddressForm(true);
                    }}
                    label="New Address"
                    className="button-main ml-3"
                  ></Button>
                ) : (
                  <form
                    action={handleAddNewAddressSubmit}
                    className="shipping-address"
                  >
                    <div className="mt-14 grid gap-4 gap-y-5 sm:grid-cols-2">
                      <div className="first-name">
                        <input
                          className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                          id="title"
                          name="title"
                          type="text"
                          value={formData?.title ?? 'Other'}
                          onChange={handleChange}
                          placeholder="Title"
                          required
                        />
                      </div>
                      <div className="first-name">
                        <input
                          className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                          id="address_line_1"
                          name="address_line_1"
                          type="text"
                          value={formData?.address_line_1}
                          onChange={handleChange}
                          placeholder="Address Line 1"
                          required
                        />
                      </div>
                      <div className="first-name">
                        <input
                          className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                          id="address_line_2"
                          name="address_line_2"
                          type="text"
                          value={formData?.address_line_2}
                          onChange={handleChange}
                          placeholder="Address Line 2"
                        />
                      </div>
                      <div className="first-name">
                        <input
                          className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                          id="city"
                          name="city"
                          type="text"
                          value={formData?.city}
                          onChange={handleChange}
                          placeholder="City"
                          required
                        />
                      </div>
                      <div className="first-name">
                        <input
                          className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                          id="state"
                          name="state"
                          type="text"
                          value={formData?.state}
                          onChange={handleChange}
                          placeholder="State"
                          required
                        />
                      </div>
                      <div className="first-name">
                        <input
                          className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                          id="postCode"
                          name="postCode"
                          type="text"
                          value={formData?.postCode}
                          onChange={handleChange}
                          placeholder="Post Code"
                          required
                        />
                      </div>
                      <div className="first-name">
                        <input
                          className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                          id="mobile"
                          name="mobile"
                          type="text"
                          value={formData?.mobile}
                          onChange={handleChange}
                          placeholder="Phone number"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 justify-items-center">
                      <div className="justify-content-end mt-4 flex">
                        <Button
                          type="submit"
                          label="Add Address"
                          loading={isLoading}
                          className="button-main mr-3"
                        ></Button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="heading5 -mb-14 -mt-5 pb-3">Shipping Address</div>
            <form
              action={handleAddNewAddressSubmit}
              className="shipping-address"
            >
              <div className="mt-14 grid gap-4 gap-y-5 sm:grid-cols-2">
                <div className="first-name">
                  <input
                    className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                    id="title"
                    name="title"
                    type="text"
                    value={formData?.title ?? 'Home'}
                    onChange={handleChange}
                    placeholder="Title"
                  />
                </div>
                <div className="first-name">
                  <input
                    className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                    id="address_line_1"
                    name="address_line_1"
                    type="text"
                    value={formData?.address_line_1}
                    onChange={handleChange}
                    placeholder="Address Line 1"
                  />
                </div>
                <div className="first-name">
                  <input
                    className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                    id="address_line_2"
                    name="address_line_2"
                    type="text"
                    value={formData?.address_line_2}
                    onChange={handleChange}
                    placeholder="Address Line 2"
                  />
                </div>
                <div className="first-name">
                  <input
                    className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                    id="city"
                    name="city"
                    type="text"
                    value={formData?.city}
                    onChange={handleChange}
                    placeholder="City"
                    required
                  />
                </div>
                <div className="first-name">
                  <input
                    className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                    id="state"
                    name="state"
                    type="text"
                    value={formData?.state}
                    onChange={handleChange}
                    placeholder="State"
                    required
                  />
                </div>
                <div className="first-name">
                  <input
                    className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                    id="postCode"
                    name="postCode"
                    type="text"
                    value={formData?.postCode}
                    onChange={handleChange}
                    placeholder="Post Code"
                    required
                  />
                </div>
                <div className="first-name">
                  <input
                    className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                    id="mobile"
                    name="mobile"
                    type="text"
                    value={formData?.mobile}
                    onChange={handleChange}
                    placeholder="Phone number"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 justify-items-center">
                <div className="justify-content-end mt-4 flex">
                  <Button
                    type="submit"
                    label="Add Address"
                    loading={isLoading}
                    className="button-main mr-3"
                  ></Button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
      <Toaster
        position="top-center"
        toastOptions={{
          className: '',
          duration: 3000,
          style: {
            background: '#363636',
            color: '#ffff',
          },
          success: {
            style: {},
          },
          error: {
            style: {},
          },
        }}
      />
    </>
  );
};

export default ShippingForm;
