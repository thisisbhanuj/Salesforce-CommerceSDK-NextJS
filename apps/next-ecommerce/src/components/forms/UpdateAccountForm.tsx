// @ts-nocheck

import React from 'react';
import { useFormState } from 'react-dom';
import toast, { Toaster } from 'react-hot-toast';

import Button from '@/components/ui/button';
import {
  changePasswordAction,
  updateAccountInfo,
} from '@/actions/user.actions';

interface Props {
  changeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accountFormData: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    password: string;
    newPassword: string;
    confirmPassword: string;
  };
  userId: string;
}

const UpdateAccountForm: React.FC<Props> = ({
  changeHandler,
  accountFormData,
  userId,
}) => {
  const [updatedPasswordState, changePassword] = useFormState(
    changePasswordAction,
    { success: false, message: '', userId: userId },
  );

  const [updatedAccountState, changeAccountDetails] = useFormState(
    updateAccountInfo,
    { success: false, message: '', userId: userId },
  );

  React.useEffect(() => {
    if (updatedAccountState.success) {
      toast.success('Account Updated');
    }

    if (updatedPasswordState.success) {
      toast.success('Psssword Updated');
    }
  }, [updatedPasswordState.success, updatedAccountState.success]);

  return (
    <>
      <Toaster />
      <form action={changeAccountDetails} className="">
        <div className="heading5 pb-4">Account Details</div>
        <div className="grid gap-4 gap-y-5 sm:grid-cols-2">
          <div className="first-name">
            <input
              className="w-full rounded-lg border-line px-4 pb-3 pt-3"
              id="firstName"
              name="firstName"
              type="text"
              value={accountFormData.firstName}
              onChange={changeHandler}
              placeholder={'First Name'}
              required
              max={60}
            />
          </div>
          <div className="last-name">
            <input
              className="w-full rounded-lg border-line px-4 pb-3 pt-3"
              id="lastName"
              name="lastName"
              type="text"
              value={accountFormData.lastName}
              onChange={changeHandler}
              placeholder={'Last Name'}
              required
              max={60}
            />
          </div>
          <div className="phone-number">
            <input
              className="w-full rounded-lg border-line px-4 pb-3 pt-3"
              id="phoneNumber"
              name="phoneNumber"
              type="text"
              value={accountFormData.phoneNumber}
              onChange={changeHandler}
              placeholder={'Mobile'}
              required
              max={10}
              min={10}
            />
          </div>
        </div>
        <div className="block-button mt-6 lg:mt-10">
          <Button type="submit" label="Update Account"></Button>
        </div>
      </form>

      <div className="bottom mt-3 border-t border-line pt-4"></div>

      <form action={changePassword} className="">
        <div className="heading5 mt-6 pb-4 lg:mt-10">Change Password</div>
        <div className="pass">
          <input
            className="w-full rounded-lg border-line px-4 pb-3 pt-3"
            id="password"
            name="password"
            type="password"
            onChange={changeHandler}
            placeholder={'Current Password *'}
            required
          />
        </div>
        <div className="new-pass mt-5">
          <input
            className="w-full rounded-lg border-line px-4 pb-3 pt-3"
            id="newPassword"
            name="newPassword"
            type="password"
            onChange={changeHandler}
            placeholder={'New Password *'}
            required
          />
        </div>
        <div className="confirm-pass mt-5">
          <input
            className="w-full rounded-lg border-line px-4 pb-3 pt-3"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            onChange={changeHandler}
            placeholder={'Confirm Password *'}
            required
          />
        </div>
        <div className="block-button mt-6 lg:mt-10">
          <Button type="submit" label="Change Password"></Button>
        </div>
      </form>
    </>
  );
};

export default UpdateAccountForm;
