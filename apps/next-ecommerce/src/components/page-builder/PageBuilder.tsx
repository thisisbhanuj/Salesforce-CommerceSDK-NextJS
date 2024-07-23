'use client';

/*
This code enables a dynamic and flexible way to manage components in the application. 
Components can be registered and unregistered, and the Pagebuilder component can 
render pages based on a design model that references these registered components.
*/

import React from 'react';
import DefaultErrorPage from 'next/error';

import { DesignStateType } from '@/DesignStateType';
import { getRegisteredComponent } from '@/registry/registry';

interface PageBuilderProps {
  name: string;
  webPageDesignModel: DesignStateType;
}

/**
 * This component is responsible for rendering the sections of a page.
 * It receives the webPageDesignModel and iterates over its sections.
 * For each section, it gets the registered component and renders it.
 *
 * @param name The name of the page.
 * @param webPageDesignModel The design model of the page.
 * @returns The rendered sections of the page.
 */
const PageBuilder = ({ name, webPageDesignModel }: PageBuilderProps) => {
  if (!webPageDesignModel?.sections?.length) {
    return (
      <div>
        <DefaultErrorPage statusCode={500} title="Error" />
      </div>
    );
  }

  const renderSections = () => {
    return webPageDesignModel.sections.map((section) => {
      const dynamicComponent = getRegisteredComponent(section.componentPath);

      if (!dynamicComponent?.component) {
        console.error(`Component not found for path: ${section.componentPath}`);
        return;
      }

      return (
        <dynamicComponent.component
          key={section.id}
          id={section.id}
          {...dynamicComponent.props}
        />
      );
    });
  };

  return renderSections();
};

export default PageBuilder;
