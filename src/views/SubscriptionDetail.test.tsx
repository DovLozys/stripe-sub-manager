import {render, getMockContextProps} from "@stripe/ui-extension-sdk/testing";
import {ContextView} from "@stripe/ui-extension-sdk/ui";

import SubscriptionDetail from "./SubscriptionDetail";

describe("SubscriptionDetail", () => {
  it("renders ContextView", () => {
    const {wrapper} = render(<SubscriptionDetail {...getMockContextProps()} />);

    expect(wrapper.find(ContextView)).toContainText("save to reload this view");
  });
});
