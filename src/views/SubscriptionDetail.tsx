import { useEffect, useState } from "react";
import Stripe from "stripe";
import type { ExtensionContextValue } from "@stripe/ui-extension-sdk/context";
import {
  createHttpClient,
  STRIPE_API_KEY,
} from "@stripe/ui-extension-sdk/http_client";
import {
  Box,
  ContextView,
  Inline,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@stripe/ui-extension-sdk/ui";

const stripe = new Stripe(STRIPE_API_KEY, {
  httpClient: createHttpClient(),
  apiVersion: "2022-11-15",
});

const SubscriptionDetail = ({
  userContext,
  environment,
}: ExtensionContextValue) => {
  const [subscription, setSubscription] = useState<Stripe.Subscription>();

  useEffect(() => {
    const getSub = async () => {
      const id = environment.objectContext?.id;
      if (!id) return;
      const sub = await stripe.subscriptions.retrieve(id, {
        expand: ["schedule.phases.items.price"],
      });
      setSubscription(sub);
    };
    getSub();
  }, []);

  console.log("Subscription: ", subscription);

  return (
    <ContextView
      title="Hello world"
      externalLink={{
        label: "View docs",
        href: "https://stripe.com/docs/stripe-apps",
      }}
    >
      <Tabs fitted>
        <TabList>
          <Tab>1</Tab>
          <Tab>2</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box css={{ padding: "medium" }}>1</Box>
          </TabPanel>
          <TabPanel>
            <Box css={{ padding: "medium" }}>2</Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Box
        css={{
          background: "container",
          borderRadius: "medium",
          marginTop: "small",
          padding: "large",
          wordBreak: "break-all",
        }}
      >
        Edit{" "}
        <Inline css={{ fontFamily: "monospace" }}>
          src/views/SubscriptionDetail.tsx
        </Inline>{" "}
        and save to reload this view.
      </Box>
      <Box>{JSON.stringify(subscription?.schedule)}</Box>
    </ContextView>
  );
};

export default SubscriptionDetail;
