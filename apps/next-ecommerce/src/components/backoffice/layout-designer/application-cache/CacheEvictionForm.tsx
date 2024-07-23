'use client';

import { useState } from 'react';

import { clearFullRouterCache } from '@/actions/backoffice';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import Button from '@/components/ui/button';

type Page = {
  pageId: string;
  pageName: string;
};

const CacheEvictionForm: React.FC = () => {
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const pages: Page[] = [
    { pageId: 'home', pageName: 'Home' },
    { pageId: 'pdp', pageName: 'PDP' },
    { pageId: 'plp', pageName: 'PLP' },
  ];

  const handleCheckboxChange = async (pageId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedPages((prevSelectedPages) =>
        new Set(prevSelectedPages).add(pageId),
      );
    } else {
      setSelectedPages((prevSelectedPages) => {
        const data = new Set(prevSelectedPages);
        data.delete(pageId);
        return data;
      });
    }
  };

  const handleClearCache = async () => {
    if (!selectedPages.size) {
      alert('Please select pages to clear cache for.');
      return;
    }

    console.log('Clearing cache for:', [...selectedPages]);

    const response = await clearFullRouterCache(selectedPages);

    if (response?.success) {
      console.log('Cache cleared successfully');
      setSelectedPages(new Set());
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-3xl font-bold">
          Clear Application Server Cache
        </h1>
        <p className="text-muted-foreground mb-8">
          This page allows you to clear the cache for specific pages on your
          application server.
        </p>
        <div className="bg-muted mb-8 rounded-lg p-6">
          <h2 className="mb-4 text-xl font-bold">
            Select pages to clear cache:
          </h2>
          <ul className="space-y-2">
            {pages.map((page) => (
              <li key={page.pageId} className="flex items-center">
                <Checkbox
                  id={`page-${page.pageId}`}
                  checked={selectedPages.has(page.pageId)}
                  onCheckedChange={() => 
                    handleCheckboxChange(
                      page.pageId, 
                      !selectedPages.has(page.pageId))
                  }
                />
                <Label
                  htmlFor={`page-${page.pageId}`}
                  className="ml-2 text-base font-medium"
                >
                  {page.pageName}
                </Label>
              </li>
            ))}
          </ul>
        </div>
        <Button
          onClick={handleClearCache}
          className="w-full"
          label="Clear Full Router Cache"
          type="submit"
        ></Button>
      </div>
    </div>
  );
};

export default CacheEvictionForm;
