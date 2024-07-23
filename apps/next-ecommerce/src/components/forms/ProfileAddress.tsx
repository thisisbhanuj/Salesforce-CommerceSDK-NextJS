// @ts-nocheck

import React, { useEffect } from 'react';
import { useFormState } from 'react-dom';
import toast, { Toaster } from 'react-hot-toast';

import Button from '@/components/ui/button';
import {
  deleteAddressAction,
  updateAddressAction,
} from '@/actions/user.actions';
import { ShippingAddressType } from '../../../types/CheckoutType';

interface Props {
  changeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  address: ShippingAddressType;
  userId: string;
}

const ProfileAddressForm: React.FC<Props> = ({
  changeHandler,
  address,
  userId,
}) => {
  const deleteAddressActionWithArgs = deleteAddressAction.bind(
    null,
    userId,
    address.id,
  );

  const [isDeleted, setIsDeleted] = React.useState(false);

  const [formState, updateAddress] = useFormState(updateAddressAction, {
    success: false,
    message: '',
    addressId: address.id,
  });

  const handleDeleteAddress = async () => {
    const res = await deleteAddressActionWithArgs();
    if (res?.success) {
      console.log('Address deleted.');
      toast.success('Address deleted.');
      setIsDeleted(true);
    }
  };

  useEffect(() => {
    if (formState.success) {
      toast.success(formState.message);
    }
  }, [formState.success, formState.message]);

  return (
    <div key={address.id} className="address">
      <div className="heading5 mb-2 pb-4">{address.title}</div>
      <form className="" action={updateAddress}>
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
            onClick={handleDeleteAddress}
            label="Delete"
          ></Button>
        </div>
        <div className="bottom mt-3 border-t border-line pt-4"></div>
      </form>
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
    </div>
  );
};

export default ProfileAddressForm;
