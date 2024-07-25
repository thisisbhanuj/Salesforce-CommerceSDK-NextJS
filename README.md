### IDEA

Headless and Composable E-Commerce Application using NextJS and Salesforce Commerce Cloud. Blend of API First and Modular Approach, not a Microservices architecture but prgresively aspired.

## How it Begin?

It started as Modular Monolithic Approach, with NextJS as FrontEnd; utilizing Vercel for deployment and managing node runtime to execute APIs.

### Apps and Packages

This Turborepo includes the following packages/apps:

- `next-ecommerce`: E-Commerce Web Application using [Next.js](https://nextjs.org/).
  It leverages following - 1. Salesforce Commerce SDK React: It is a collection of react-query hooks for fetching, caching and mutating data from the Salesforce B2C Commerce Shopper API (SCAPI). 2. Salesforce Isomorphic SDK : This SDK provides a Browser & Node.js JavaScript client for calling B2C Commerce Shopper APIs.
- `sfcc-isomorphic-scapi` : Repo holds the code for Salesforce Commerce SDK React & Salesforce Isomorphic SDK, integration.
- `sfcc-nodejs-runtime` : Salesforce Commerce Cloud Backend using Commerce-SDK for NodeJS Runtime,
- `sfcc-scapi` : Salesforce Commerce Cloud API (SCAPI) implementations for truly MACH (Microservices-APIFirst-Composable-Headless) Architecture. The APIs can be Shopper/Admin/Custom APIs and can be called from Browser and NodeJS.
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
yarn build
```

### Run

To run e-commerce application in local, run the following command:

```
yarn dev
```

### Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
