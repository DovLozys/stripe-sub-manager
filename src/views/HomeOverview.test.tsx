import {render, getMockContextProps} from "@stripe/ui-extension-sdk/testing";
import {ContextView} from "@stripe/ui-extension-sdk/ui";

import HomeOverview from "./HomeOverview";

describe("HomeOverview", () => {
  it("renders ContextView", () => {
    const {wrapper} = render(<HomeOverview {...getMockContextProps()} />);

    expect(wrapper.find(ContextView)).toContainText("save to reload this view");
  });
});
