import { useState, useEffect } from 'react';
import Stripe from 'stripe';
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context';
import {
  createHttpClient,
  STRIPE_API_KEY,
} from '@stripe/ui-extension-sdk/http_client';
import {
  Banner,
  Box,
  Button,
  ContextView,
  Icon,
  Inline,
} from '@stripe/ui-extension-sdk/ui';

import { getNotesForCustomer } from '../api';
import { APIResponse, Note } from '../types';

import AddNoteView from '../components/AddNoteView';
import Notes from '../components/Notes';

import BrandIcon from './brand_icon.svg';

const stripe = new Stripe(STRIPE_API_KEY, {
  httpClient: createHttpClient(),
  apiVersion: '2022-11-15',
});

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const CustomerDetail = ({
  userContext,
  environment,
}: ExtensionContextValue) => {
  const customerId = environment?.objectContext?.id;

  const staffId = userContext?.account.id || '';
  const staffName = userContext?.account.name || '';

  const [showAddNoteView, setShowAddNoteView] = useState<boolean>(false);
  const [showAddNoteSuccessMessage, setShowAddNoteSuccessMessage] =
    useState<boolean>(false);
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
  };

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

  return (
    <ContextView
      title="Customer subs"
      description={customerId}
      brandColor="#faae40"
      brandIcon={BrandIcon}
      actions={
        <Button
          type="primary"
          css={{ width: 'fill', alignX: 'center' }}
          onPress={() => {
            setShowAddNoteView(true);
          }}
        >
          <Box css={{ stack: 'x', gap: 'small', alignY: 'center' }}>
            <Icon name="addCircle" size="xsmall" />
            <Inline>Add note</Inline>
          </Box>
        </Button>
      }
    >
      {showAddNoteSuccessMessage && (
        <Box css={{ marginBottom: 'small' }}>
          <Banner
            type="default"
            onDismiss={() => setShowAddNoteSuccessMessage(false)}
            title="New note added"
          />
        </Box>
      )}
      <AddNoteView
        isOpen={showAddNoteView}
        customerId={customerId as string}
        staffId={staffId}
        onSuccessAction={() => {
          setShowAddNoteView(false);
          setShowAddNoteSuccessMessage(true);
          getNotes();
        }}
        onCancelAction={() => {
          setShowAddNoteView(false);
        }}
      />

      <Box css={{ stack: 'y' }}>
        <Box css={{}}>
          <Inline
            css={{
              font: 'heading',
              color: 'primary',
              fontWeight: 'semibold',
              paddingY: 'medium',
            }}
          >
            View all notes {customer ? `for ${customer.name}` : ''}
          </Inline>

          <Notes notes={notes} />
        </Box>
        <Button
          type="primary"
          css={{ width: 'fill', alignX: 'center' }}
          onPress={retrieveCurrentCustomer}
        >
          <Box css={{ stack: 'x', gap: 'small', alignY: 'center' }}>
            <Icon name="subscription" size="xsmall" />
            Get subscriptions
          </Box>
        </Button>
        <Box>
          {subs.map((sub) => {
            return (
              <Box key={sub.id}>
                <Box>
                  {formatter.format(sub.plan.amount / 100) +
                    ` ${sub.plan.currency} per ${sub.plan.interval}`}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </ContextView>
  );
};

export default CustomerDetail;
