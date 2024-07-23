'use client';

import React, { useState } from 'react';
import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';

import { updatedPageDesignFormStateAction } from '@/actions/backoffice';
import Button from '@/components/ui/button';

type updatePageDeisgnActionState = {
  success: boolean;
  message: string;
  pageId: string;
};

type PageDeisgnFormState = {
  pageId: string;
  pageJSON: string;
};

type Props = {
  pageName: string;
};

const PageLayoutUpdateForm: React.FC<Props> = ({ pageName }) => {
  const [formData, setFormData] = useState<PageDeisgnFormState>({
    pageId: '',
    pageJSON: '',
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const [updatedState, pageDesignFormStateAction] = useFormState(
    (prevState: updatePageDeisgnActionState, formData: FormData) =>
      updatedPageDesignFormStateAction(prevState, formData),
    { success: false, pageId: pageName, message: '' },
  );

  const router = useRouter();
  const handleClearCache = () => {
    router.push('/backoffice/builder/cache');
  };

  React.useEffect(() => {
    if (updatedState.success) {
      setFormData({ pageId: updatedState.pageId, pageJSON: '' });
    }
  }, [updatedState.success]);

  return (
    <div className="update-page-deisgn">
      <button
        className={`button-main absolute left-4 top-4`}
        onClick={() => window.history.back()}
      >
        BACK
      </button>
      <div className="heading3 pb-5">Update Page Design</div>
      <div className="grid grid-cols-1 justify-center gap-4 gap-y-5 text-center">
        <form action={pageDesignFormStateAction}>
          <input
            type="text"
            id="pageId"
            name="pageId"
            value={pageName}
            hidden
            readOnly
          />

          <div className="first-name">
            <label htmlFor="pageJSON" className="heading6">
              Page JSON for {pageName}
            </label>
            <textarea
              id="pageJSON"
              name="pageJSON"
              className="w-full rounded-lg border-line px-4 pb-3 pt-3"
              value={formData.pageJSON}
              onChange={handleChange}
              rows={10}
              required
            />
          </div>
          <button type="submit" className={`button-main`}>
            {' '}
            Update Page Design
          </button>
        </form>
        {updatedState.success && (
          <>
            <div className="message">{updatedState.message}</div>
            <Button
              label="Proceed To Clear Cache"
              type="submit"
              className="button-main"
              onClick={handleClearCache}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default PageLayoutUpdateForm;
