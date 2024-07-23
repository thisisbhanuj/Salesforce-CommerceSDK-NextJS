'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BounceLoader from 'react-spinners/BounceLoader';

import Base from '@/components/customization/Base';
import Gender from '@/components/customization/Gender';
import Material from '@/components/customization/Material';
import { CustomizationContext } from '@/context/CustomizationContext';

const Customization = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  const { selectedGender, selectedMaterial, selectedProduct } =
    React.useContext(CustomizationContext);

  useEffect(() => {
    if (
      currentStep === 4 &&
      selectedGender &&
      selectedMaterial &&
      selectedProduct
    ) {
      router.push('/threejs');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  return (
    <div className="customization-preselection mb-2 mt-4 flex flex-col items-center justify-center">
      {currentStep === 4 ? (
        <>
          <div className="customization-waiting-text">
            <div>Good things take time,</div>{' '}
            <div>smile while we build your dream</div>
          </div>
          <BounceLoader color="rgb(57, 206, 176)" loading={true} size={180} />
        </>
      ) : (
        <div className="w-full max-w-sm">
          {currentStep === 1 && <Gender onNext={() => setCurrentStep(2)} />}
          {currentStep === 2 && <Base onNext={() => setCurrentStep(3)} />}
          {currentStep === 3 && <Material onNext={() => setCurrentStep(4)} />}
        </div>
      )}
    </div>
  );
};

export default Customization;
