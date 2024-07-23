import Carousel from '@/components/standalone/Carousel';
import Collection from '@/components/home/Collection';
import Banner from '@/components/home/Banner';
import Benefit from '@/components/home/Benefit';
import Testimonial from '@/components/home/Testimonial';
import Instagram from '@/components/home/Instagram';
import Footer from '@/components/footer/Footer';
import Reviews from '@/components/product/Detail/Reviews';
import SubjectiveInformation from '@/components/product/Detail/SubjectiveInformation';
import RelatedProducts from '@/components/product/Detail/RelatedProducts';
import ImageContainer from '@/components/product/Detail/ImageContainer';
import PurchaseView from '@/components/product/Detail/PurchaseView';

import { BaseComponentProps } from './PropsInterface';

/*
  This library is used to register components that are used in the CMS.
  The key is the component path and the value is the component itself.
  The path is used to identify the component in the CMS.
  The component is the React component that will be rendered in the CMS.

  Benefits:
  *********
  Scalability: This approach allows you to easily register a large number of components by adding them to the Map.
  Performance: Maps offer efficient key lookups compared to plain objects, especially for larger datasets.
  Flexibility: Maps can handle various key types (strings in this case), providing more flexibility than object literals.
*/
export type RegisteredComponent<Props extends BaseComponentProps> = {
  component: React.ComponentType<Props>;
  props?: Props;
};

/*
  This map is used to store the registered components.
  The key is the component path and the value is the registered component.
*/
const registeredComponents = new Map<string, RegisteredComponent<any>>([
  [
    '/components/home/Testimonial',
    {
      component: Testimonial,
    },
  ],
  [
    '/components/standalone/Carousel',
    {
      component: Carousel,
      props: {
        pageName: 'home',
        position: 'hero',
      },
    },
  ],
  [
    '/components/home/Collection',
    {
      component: Collection,
    },
  ],
  [
    '/components/home/Banner',
    {
      component: Banner,
    },
  ],
  [
    '/components/home/Benefit',
    {
      component: Benefit,
    },
  ],
  [
    '/components/home/Instagram',
    {
      component: Instagram,
    },
  ],
  [
    '/components/footer/Footer',
    {
      component: Footer,
    },
  ],
  [
    '/components/product/Detail/Reviews',
    {
      component: Reviews,
    },
  ],
  [
    '/components/product/Detail/SubjectiveInformation',
    {
      component: SubjectiveInformation,
    },
  ],
  [
    '/components/product/Detail/RelatedProducts',
    {
      component: RelatedProducts,
    },
  ],
  [
    '/components/product/Detail/ImageContainer',
    {
      component: ImageContainer,
    },
  ],
  [
    '/components/product/Detail/PurchaseView',
    {
      component: PurchaseView,
    },
  ],
]);

/**
 * Register a component to be used in the CMS.
 * @param path The path of the component.
 * @param component The React component to be registered.
 * @param props The props to be passed to the component.
 * @example
 * registerComponent('/components/home/Banner', Banner, { title: 'Banner title' });
 */
export const registerComponent = <Props extends BaseComponentProps>(
  path: string,
  component: React.ComponentType<Props>,
  props?: Props,
): void => {
  registeredComponents.set(path, { component, props });
};

/**
 * Unregister a component from the CMS.
 * @param path The path of the component.
 * @example
 * unregisterComponent('/components/home/Banner');
 */
export const unregisterComponent = (path: string): void => {
  registeredComponents.delete(path);
};

/**
 * Get a registered component by its path.
 * @param path The path of the component.
 * @returns The registered component or undefined if it does not exist.
 * @example
 * const component = getRegisteredComponent('/components/home/Banner');
 * if (component) {
 *  return <component.component {...component.props} />;
 * }
 * return null;
 *
 **/
export const getRegisteredComponent = (
  path: string,
): RegisteredComponent<any> | undefined => {
  return registeredComponents.get(path);
};
