import { useEffect, useState } from 'react';
import Stripe from 'stripe';
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context';
import {
  STRIPE_API_KEY,
  createHttpClient,
} from '@stripe/ui-extension-sdk/http_client';
import {
  Box,
  Button,
  ContextView,
  Divider,
  Inline,
  TextField,
} from '@stripe/ui-extension-sdk/ui';

const stripe = new Stripe(STRIPE_API_KEY, {
  httpClient: createHttpClient(),
  apiVersion: '2022-11-15',
});

const InvoiceDetail = ({ userContext, environment }: ExtensionContextValue) => {
  const [invoice, setInvoice] = useState<Stripe.Invoice>();

  useEffect(() => {
    const retrieveInvoice = async () => {
      const invoice = await stripe.invoices.retrieve(
        environment.objectContext.id
      );
      console.log('Invoice > ', invoice);
      setInvoice(invoice);
    };
    retrieveInvoice();
  }, []);

  const updateInvoice = (e) => {
    console.log('Event target -> ', e.target.value);
    setInvoice({ ...invoice, metadata: { state: e.target.value } });
  };

  const postInvoice = async () => {
    await stripe.invoices.update(environment.objectContext?.id, {
      metadata: invoice?.metadata,
    });
  };

  return (
    <ContextView title="Invoicer">
      <Box
        css={{
          background: 'container',
          borderRadius: 'medium',
          marginTop: 'small',
          padding: 'large',
          wordBreak: 'break-all',
        }}
      >
        <TextField
          defaultValue={JSON.stringify(invoice?.metadata.status)}
          onChange={updateInvoice}
        ></TextField>
        <Button onPress={postInvoice}>Submit</Button>
      </Box>
      <Box
        css={{
          background: 'container',
          borderRadius: 'medium',
          marginTop: 'small',
          padding: 'large',
          wordBreak: 'break-all',
        }}
      >
        <Inline css={{ fontFamily: 'monospace' }}>
          {JSON.stringify(invoice?.metadata, null, 2)}
        </Inline>
        <Divider></Divider>
        <Inline css={{ fontFamily: 'monospace' }}>
          {JSON.stringify(invoice?.status, null, 2)}
        </Inline>
      </Box>
    </ContextView>
  );
};

export default InvoiceDetail;
