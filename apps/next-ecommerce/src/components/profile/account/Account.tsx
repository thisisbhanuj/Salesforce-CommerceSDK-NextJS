'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import * as Icon from '@phosphor-icons/react/dist/ssr';

import { ShippingAddressType } from '@/CheckoutType';
import { CartType } from '@/CartType';
import { useCart } from '@/context/CartContext';
import AddNewProfileAddressForm from '@/components/forms/AddNewProfileAddressForm';
import ProfileAddressForm from '@/components/forms/ProfileAddress';
import UpdateAccountForm from '@/components/forms/UpdateAccountForm';

import { fetchAddressesAction } from '@/actions/user.actions';
import { useFormState } from 'react-dom';

type CartContent =
  | {
      success: boolean | null;
      message: string | null;
      userCartModel: {} | CartType | null;
    }
  | null
  | {};

type Props = {
  cartContent?: CartContent;
};

const Account: React.FC<Props> = ({ cartContent }) => {
  const { data: client_session } = useSession();
  const router = useRouter();
  const { loadCart } = useCart();

  const userId = client_session?.user.id;
  // const logoutHandler = () => {
  //     signOut();
  // }

  const [accountFormData, setAccountFormData] = useState({
    firstName: client_session?.user.firstName || '',
    lastName: client_session?.user?.lastName || '',
    phoneNumber: client_session?.user?.mobile || '',
    password: '',
    newPassword: '',
    confirmPassword: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postCode: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountFormData({
      ...accountFormData,
      [name]: value,
    });
  };

  const [addressesState, addressesStateAction] = useFormState(
    (prevState: {
      success: boolean;
      message?: string;
      userId?: string;
      data?: ShippingAddressType[];
    }) => fetchAddressesAction(prevState),
    { success: false, message: '', userId: userId, data: [] },
  );

  const handleReload = () => {
    router.refresh();
  };

  React.useEffect(() => {
    if (
      cartContent &&
      'success' in cartContent &&
      cartContent.success &&
      cartContent.userCartModel
    ) {
      const currentCartModel =
        JSON.parse(cartContent.userCartModel.toString()) ?? {};
      const commerceItems =
        currentCartModel.commerceItems ?? ([] as CartType['commerceItems']);
      loadCart(commerceItems);
    }
  }, [cartContent]);

  return (
    <div className="py-10 md:py-20">
      <div className="container">
        <div className="content-main flex w-full gap-y-8 max-md:flex-col md:px-4 lg:px-[60px]">
          <div className="left w-full md:w-5/12 md:pr-[16px] lg:pr-[28px] xl:w-1/3 xl:pr-[40px]">
            <div className="user-infor rounded-xl bg-white px-5 py-6 md:rounded-[20px] md:px-8 md:py-10">
              <div className="heading flex flex-col items-center justify-center">
                <div className="name heading6 mb-1 text-center">
                  {client_session?.user?.name}
                </div>
                <div className="mail heading6 mt-1 text-center font-normal normal-case">
                  {client_session?.user?.email}
                </div>
              </div>
              <div className="profile-links -mt-5.5 sm:mt-3 lg:mt-10">
                <div className="profile-link-item">
                  <Icon.User size={20} weight="bold" />
                  <button className="heading6" onClick={handleReload}>
                    Account Info
                  </button>
                </div>
                <div className="profile-link-item">
                  <Icon.ListHeart size={20} weight="bold" />
                  <div className="heading6">
                    <Link href={'/profile/wishlist'} className="heading6">
                      Wishlist
                    </Link>
                  </div>
                </div>
                <div className="profile-link-item">
                  <Icon.Bag size={20} weight="bold" />
                  <div className="heading6">
                    <Link href={'/profile/orders'} className="heading6">
                      Orders
                    </Link>
                  </div>
                </div>
                <div className="profile-link-item">
                  <Icon.MapPin size={20} weight="bold" />
                  <div className="heading6">
                    <Link
                      href={'/profile'}
                      className="heading6"
                      onClick={() => {
                        addressesStateAction();
                      }}
                    >
                      Addresses
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="right flex w-full items-center md:w-7/12 md:pl-[16px] lg:pl-[28px] xl:w-2/3 xl:pl-[40px]">
            <div className="text-content w-full">
              {addressesState?.success ? (
                <div className="addresses">
                  <div className="heading5 mb-10 pb-4">Shipping Address</div>
                  {addressesState?.data?.length ?? 0 > 0 ? (
                    addressesState?.data?.map((address) => (
                      <ProfileAddressForm
                        key={address.id}
                        address={address}
                        changeHandler={handleChange}
                        userId={addressesState.userId}
                      />
                    ))
                  ) : (
                    <AddNewProfileAddressForm
                      changeHandler={handleChange}
                      userId={addressesState.userId ?? ''}
                    />
                  )}
                </div>
              ) : (
                <UpdateAccountForm
                  changeHandler={handleChange}
                  userId={client_session?.user.id}
                  accountFormData={accountFormData}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
