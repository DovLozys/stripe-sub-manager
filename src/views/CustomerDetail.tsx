import { useEffect, useState } from "react";

import Stripe from "stripe";
import {
  createHttpClient,
  STRIPE_API_KEY,
} from "@stripe/ui-extension-sdk/http_client";
import {
  Accordion,
  AccordionItem,
  Box,
  ContextView,
  List,
  ListItem,
} from "@stripe/ui-extension-sdk/ui";

import BrandIcon from "./brand_icon.svg";

const stripe = new Stripe(STRIPE_API_KEY, {
  httpClient: createHttpClient(),
  apiVersion: "2022-11-15",
});

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const CustomerDetail = () => {
  const [subSched, setSubSched] = useState<Stripe.SubscriptionSchedule>();

  const getSubSchedule = async () => {
    const subscriptionSchedule = await stripe.subscriptionSchedules.retrieve(
      "sub_sched_1MtpSTC9XCoseyDYCmwTMKWW",
      { expand: ["phases.items.price.product"] }
    );

    setSubSched(subscriptionSchedule);
  };

  useEffect(() => {
    getSubSchedule();
  }, []);

  return (
    <ContextView
      title="Subscription Schedule"
      brandIcon={BrandIcon}
      brandColor="orange"
    >
      <Accordion>
        <AccordionItem title={subSched?.metadata?.subscription_type}>
          <List>
            {subSched &&
              Object.entries(subSched?.metadata).map(([key, value]) => {
                return (
                  <ListItem
                    title={<Box>{key}</Box>}
                    secondaryTitle={<Box>{value}</Box>}
                    key={key}
                  ></ListItem>
                );
              })}
          </List>
          {subSched?.phases.map((phase, i) => {
            return (
              <AccordionItem title={`Phase ${i}`} key={crypto.randomUUID()}>
                {phase.items.map((item, i) => {
                  return (
                    <AccordionItem
                      title={item.price.product.name}
                      subtitle={`${
                        item.price.product.description
                      } at ${formatter.format(item.price.unit_amount / 100)}/${
                        item.price.recurring.interval
                      }`}
                      key={crypto.randomUUID()}
                    >
                      <Box>Metadata:</Box>
                      <List>
                        {Object.entries(item.metadata).map(([key, value]) => {
                          return (
                            <ListItem
                              title={<Box>{key}</Box>}
                              secondaryTitle={<Box>{value}</Box>}
                              key={key}
                            ></ListItem>
                          );
                        })}
                      </List>
                    </AccordionItem>
                  );
                })}
              </AccordionItem>
            );
          })}
        </AccordionItem>
      </Accordion>
    </ContextView>
  );
};

export default CustomerDetail;
