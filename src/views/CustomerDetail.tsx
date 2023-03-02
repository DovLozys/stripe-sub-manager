import { useState, useEffect } from 'react';
import Stripe from 'stripe';
import {
  createHttpClient,
  STRIPE_API_KEY,
} from '@stripe/ui-extension-sdk/http_client';
import { Box, Button, ContextView, Inline, Link } from '@stripe/ui-extension-sdk/ui';
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context';

import BrandIcon from './brand_icon.svg';
import { getNotesForCustomer } from '../api';
import { APIResponse, Note } from '../types';
import Notes from '../components/Notes';

const stripe = new Stripe(STRIPE_API_KEY, {
  httpClient: createHttpClient(),
  apiVersion: '2022-11-15',
});

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const CustomerDetail = ({ userContext, environment }: ExtensionContextValue) => {
  const customerId = environment?.objectContext?.id;

  const staffId = userContext?.account.id as string;
  const staffName = userContext?.account.name as string;

  const [notes, setNotes] = useState<Note[] | null>(null);
  const [customer, setCustomer] = useState<
    Stripe.Customer | Stripe.DeletedCustomer
  >();
  const [subs, setSubs] = useState<Stripe.Subscription[]>([]);

  const getNotes = () => {
    if (!customerId) {
      return;
    }

    getNotesForCustomer({ customerId }).then((res: APIResponse) => {
      if (!res.error) {
      console.log(res.data);
        setNotes(res.data.notes);
      }
    }); 
  }

  const retrieveCurrentCustomer = async () => {
    try {
      if (!environment.objectContext) throw new Error('missing objectContext');

      const cust = await stripe.customers.retrieve(
        environment.objectContext.id,
        {
          expand: ['subscriptions'],
        }
      );

      setCustomer(cust);
      setSubs(cust.subscriptions.data);
      // console.log(
      //   (cust.subscriptions as Stripe.ApiList<Stripe.Subscription>).data
      // );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getNotes();
  }, [customerId]);
//  useEffect(() => {
//    (async () => {
//      await retrieveCurrentCustomer();
//    })();
//  }, []);
  console.log(notes);

  return (
    <ContextView
      title="Customer subs"
      description={customerId}
      brandColor="#faae40"
      brandIcon={BrandIcon}
    >
      <Box>
        <Box>
          <Inline
            css={{
              font: "heading",
              color: "primary",
              fontWeight: "semibold",
              paddingY: "medium"
            }}
          >
            View all notes
          </Inline>

          <Notes notes={notes} />
        </Box>
      </Box>
      <Box css={{ height: 'fill', stack: 'y', distribute: 'space-between' }}>
        <Button type="primary" onPress={retrieveCurrentCustomer}>
          Get subscriptions
        </Button>

        <Box>
          {customer ? customer.name : ''}

          {subs.map((sub) => {
            return (
              <Box key={sub.id}>
                {sub.items.data[0].plan.nickname}
                {formatter.format(sub.plan.amount / 100)}
              </Box>
            );
          })}
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

export default CustomerDetail;
