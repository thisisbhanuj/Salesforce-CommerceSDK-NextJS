'use client';

import React from 'react';
import { useSCAPISession } from '@/hooks/useSCAPISession';

const SFCCSessionComponent: React.FC = () => {
  useSCAPISession();

  return null;
};

export default SFCCSessionComponent;
