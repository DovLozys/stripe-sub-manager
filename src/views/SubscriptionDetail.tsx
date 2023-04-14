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
  List,
  ListItem,
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
  const [subscriptionSchedule, setSubSched] =
    useState<Stripe.SubscriptionSchedule>();

  useEffect(() => {
    const getSub = async () => {
      const id = environment.objectContext?.id;
      if (!id) return;
      const sub = await stripe.subscriptions.retrieve(id);
      setSubscription(sub);
    };
    getSub();
  }, []);

  useEffect(() => {
    const getSubSched = async () => {
      const id = subscription?.schedule;

      const subSched = await stripe.subscriptionSchedules.retrieve(id);
      setSubSched(subSched);
    };
    getSubSched();
  }, [subscription]);

  console.log("Subscription Schedule: ", subscriptionSchedule);

  if (!subscription?.schedule) {
    return <Box>None</Box>;
  }

  return (
    <ContextView title="Subscription Scheduler">
      <Tabs fitted>
        <TabList>
          <Tab>Contract</Tab>
          <Tab>Phases/Items</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box css={{ padding: "medium" }}>
              {subscriptionSchedule &&
                Object.entries(subscriptionSchedule?.metadata).map(
                  ([key, value]) => {
                    return (
                      <List>
                        <ListItem
                          title={<Box>{key}</Box>}
                          secondaryTitle={<Box>{value}</Box>}
                          key={key}
                        ></ListItem>
                      </List>
                    );
                  }
                )}
            </Box>
          </TabPanel>
          <TabPanel>
            <Box css={{ padding: "medium" }}>2</Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </ContextView>
  );
};

export default SubscriptionDetail;
