// @ts-nocheck

'use client';

import React, { useEffect } from 'react';
import { useFormState } from 'react-dom';
import toast, { Toaster } from 'react-hot-toast';

import Button from '@/components/ui/button';
import {
  addNewProfileAddressActionWithFormState,
  deleteAddressAction,
  updateAddressAction,
} from '@/actions/user.actions';
import { ShippingAddressType } from '../../../types/CheckoutType';

interface Props {
  changeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  userId: string;
}

type addAddressActionState = {
  success: boolean;
  data: ShippingAddressType[] | null;
  userId: string;
  message: string;
};

type updateAssressActionState = {
  success: boolean;
  message: string;
  addressId: string;
};

const AddNewProfileAddressForm: React.FC<Props> = ({
  changeHandler,
  userId,
}) => {
  const [newAddressState, addAddress] = useFormState(
    (prevState: addAddressActionState, formData: FormData) =>
      addNewProfileAddressActionWithFormState(prevState, formData),
    { success: false, data: null, userId: userId, message: '' },
  );
  const [updatedFormState, updateAddress] = useFormState(
    (prevState: updateAssressActionState, formData: FormData) =>
      updateAddressAction(prevState, formData),
    { success: false, message: '', addressId: '' },
  );

  useEffect(() => {
    if (updatedFormState.success) {
      toast.success(updatedFormState.message);
    }

    if (newAddressState?.success) {
      toast.success('Address Added');
    }
  }, [
    updatedFormState.success,
    updatedFormState.message,
    newAddressState?.success,
  ]);

  return (
    <>
      {newAddressState?.success &&
      newAddressState?.data?.length &&
      newAddressState.data.length > 0 ? (
        newAddressState.data.map((address: any) => (
          <div key={address.id} className="address">
            <div className="heading5 mb-2 pb-4">{address.title}</div>
            <form className="" action={updateAddress}>
              <div>
                <input
                  id="addressId"
                  name="addressId"
                  hidden
                  value={address.id}
                />
              </div>
              <div className="grid gap-4 gap-y-5 sm:grid-cols-2">
                <div className="first-name">
                  <input
                    className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                    id="address_line_1"
                    name="address_line_1"
                    type="text"
                    onChange={changeHandler}
                    placeholder={address.address_line_1}
                  />
                </div>
                <div className="first-name">
                  <input
                    className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                    id="address_line_2"
                    name="address_line_2"
                    type="text"
                    onChange={changeHandler}
                    placeholder={address.address_line_2}
                  />
                </div>
                <div className="first-name">
                  <input
                    className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                    id="city"
                    name="city"
                    type="text"
                    onChange={changeHandler}
                    placeholder={address.city}
                  />
                </div>
                <div className="first-name">
                  <input
                    className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                    id="state"
                    name="state"
                    type="text"
                    onChange={changeHandler}
                    placeholder={address.state}
                  />
                </div>
                <div className="first-name">
                  <input
                    className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                    id="postCode"
                    name="postCode"
                    type="text"
                    onChange={changeHandler}
                    placeholder={address.postCode}
                  />
                </div>
                <div className="first-name">
                  <input
                    className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                    id="mobile"
                    name="mobile"
                    type="text"
                    onChange={changeHandler}
                    placeholder={address.mobile}
                  />
                </div>
              </div>
              <div className="block-button mt-6 lg:mt-10">
                <Button type="submit" className="mr-3" label="Update"></Button>
                <Button
                  type="button"
                  onClick={() => deleteAddressAction(userId, address.id)}
                  label="Delete"
                ></Button>
              </div>
              <div className="bottom mt-3 border-t border-line pt-4"></div>
            </form>
          </div>
        ))
      ) : (
        <div key={'new_add'} className="address">
          <form action={addAddress} className="">
            <div className="grid gap-4 gap-y-5 sm:grid-cols-2">
              <div className="first-name">
                <input
                  className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Home"
                  required
                />
              </div>
              <div className="first-name">
                <input
                  className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                  id="address_line_1"
                  name="address_line_1"
                  type="text"
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
                  placeholder="Address Line 2"
                />
              </div>
              <div className="first-name">
                <input
                  className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                  id="city"
                  name="city"
                  type="text"
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
                  placeholder="Phone number"
                  required
                />
              </div>
            </div>
            <div className="block-button mt-6 lg:mt-10">
              <Button
                type="submit"
                className="mr-3"
                label="Add Address"
              ></Button>
            </div>
            <div className="bottom mt-3 border-t border-line pt-4"></div>
          </form>
        </div>
      )}
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

export default AddNewProfileAddressForm;
