import { useEffect, useState } from 'react';
import Stripe from 'stripe';
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context';
import {
  createHttpClient,
  STRIPE_API_KEY,
} from '@stripe/ui-extension-sdk/http_client';
import {
  AccordionItem,
  Box,
  Button,
  ContextView,
  Icon,
  Link,
  List,
  ListItem,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@stripe/ui-extension-sdk/ui';

const stripe = new Stripe(STRIPE_API_KEY, {
  httpClient: createHttpClient(),
  apiVersion: '2022-11-15',
});

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const SubscriptionDetail = ({
  userContext,
  environment,
}: ExtensionContextValue) => {
  const [editable, setEditable] = useState(false);
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
    if (!subscription) return;
    const getSubSched = async () => {
      const id = subscription.schedule;

      const subSched = await stripe.subscriptionSchedules.retrieve(id, {
        expand: ['phases.items.price.product'],
      });
      setSubSched(subSched);
    };
    getSubSched();
  }, [subscription]);

  const toggleEditable = () => {
    setEditable(!editable);
  };

  console.log('Subscription Schedule: ', subscriptionSchedule);

  if (!subscription?.schedule) {
    return <Box>None</Box>;
  }

  return (
    <ContextView title="Subscription Scheduler">
      <Tabs fitted>
        <TabList>
          <Tab tabKey="contract">Contract</Tab>
          <Tab tabKey="phases_items">Phases/Items</Tab>
        </TabList>
        <TabPanels>
          <TabPanel tabKey="contract">
            <Box
              css={{
                padding: 'medium',
              }}
            >
              <Box css={{ distribute: 'space-between', stack: 'x' }}>
                Metadata:
                <Button onPress={toggleEditable}>
                  <Icon name="edit" />
                  Edit
                </Button>
              </Box>
              <List>
                {subscriptionSchedule &&
                  Object.entries(subscriptionSchedule.metadata).map(
                    ([key, value]) => {
                      if (key === 'salesforce_order_link') {
                        return (
                          <ListItem
                            title={<Box>{key}</Box>}
                            secondaryTitle={
                              <Link href={value} target="_blank">
                                {value}
                              </Link>
                            }
                            key={key}
                          />
                        );
                      }
                      return (
                        <ListItem
                          title={<Box>{key}</Box>}
                          secondaryTitle={<Box>{value}</Box>}
                          key={key}
                        />
                      );
                    }
                  )}
              </List>
            </Box>
          </TabPanel>
          <TabPanel tabKey="phases_items">
            <Box css={{ padding: 'medium' }}>
              {subscriptionSchedule &&
                subscriptionSchedule.phases.map((phase, i) => {
                  return (
                    <AccordionItem
                      title={`Phase ${i} items`}
                      key={crypto.randomUUID()}
                    >
                      {phase.items.map((item, i) => {
                        return (
                          <Box
                            css={{
                              background: 'container',
                              borderRadius: 'medium',
                              marginTop: 'small',
                            }}
                            key={crypto.randomUUID()}
                          >
                            <AccordionItem
                              title={item.price.product.name}
                              subtitle={`${
                                item.price.product.description
                              } at ${formatter.format(
                                item.price.unit_amount / 100
                              )}/${item.price.recurring.interval}`}
                              key={crypto.randomUUID()}
                            >
                              <Box
                                css={{
                                  distribute: 'space-between',
                                  stack: 'x',
                                }}
                              >
                                Metadata:
                                <Button onPress={toggleEditable}>
                                  <Icon name="edit" />
                                  Edit
                                </Button>
                              </Box>
                              <List>
                                {Object.entries(item.metadata).map(
                                  ([key, value]) => {
                                    return (
                                      <ListItem
                                        title={<Box>{key}</Box>}
                                        secondaryTitle={<Box>{value}</Box>}
                                        key={key}
                                      />
                                    );
                                  }
                                )}
                              </List>
                            </AccordionItem>
                          </Box>
                        );
                      })}
                    </AccordionItem>
                  );
                })}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </ContextView>
  );
};

export default SubscriptionDetail;
