import {
  createHttpClient,
  STRIPE_API_KEY,
} from '@stripe/ui-extension-sdk/http_client';
import Stripe from 'stripe';
import { Box, ContextView, Inline, Link } from '@stripe/ui-extension-sdk/ui';
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context';

import BrandIcon from './brand_icon.svg';

const stripe = new Stripe(STRIPE_API_KEY, {
  httpClient: createHttpClient(),
  apiVersion: '2022-11-15',
});

const App = ({ userContext, environment }: ExtensionContextValue) => {
  const retrieveCurrentCustomer = async (customerId: string) => {
    try {
      const customer = await stripe.customers.retrieve(customerId);
      // const subs = await stripe.subscriptions.retrieve() ?

      console.log(customer);
    } catch (error) {
      console.error(error);
    }
  };

  if (environment.objectContext) {
    retrieveCurrentCustomer(environment.objectContext.id);
  }

  return (
    <ContextView
      title="Henlo world"
      brandColor="#F6F8FA"
      brandIcon={BrandIcon}
      externalLink={{
        label: 'View docs',
        href: 'https://stripe.com/docs/stripe-apps',
      }}
    >
      <Box css={{ height: 'fill', stack: 'y', distribute: 'space-between' }}>
        <Box
          css={{
            background: 'container',
            borderRadius: 'medium',
            marginTop: 'small',
            padding: 'large',
          }}
        >
          Edit{' '}
          <Inline css={{ fontFamily: 'monospace' }}>src/views/App.tsx</Inline>{' '}
          and save to reload this view.
        </Box>

        <Box css={{ color: 'secondary' }}>
          <Box css={{ marginBottom: 'medium' }}>
            Learn more about views, authentication, and accessing data in{' '}
            <Link
              href="https://stripe.com/docs/stripe-apps"
              target="blank"
              type="secondary"
            >
              Stripe Apps docs
            </Link>
            .
          </Box>

          <Box css={{ marginBottom: 'medium' }}>
            Questions? Get help with your app from the{' '}
            <Link
              href="https://github.com/stripe/stripe-apps/wiki/Developer-Support"
              target="blank"
              type="secondary"
            >
              Stripe Apps wiki
            </Link>
            .
          </Box>
        </Box>
      </Box>
    </ContextView>
  );
};

export default App;
