import { useEffect, useState } from "react";
import { Box, ContextView, Inline } from "@stripe/ui-extension-sdk/ui";
import type { ExtensionContextValue } from "@stripe/ui-extension-sdk/context";
import { APIResponse, Note } from "../types";
import * as api from "../api";
import Notes from "../components/Notes";

const HomeOverview = ({userContext, environment}: ExtensionContextValue) => {
  const staffName = userContext?.account.name as string;
  const [notes, setNotes] = useState<Note[] | null>(null);

  const getAllNotes = () => {
    api.getAllNotes().then((res: APIResponse) => {
      if (!res.data.error) {
          setNotes(res.data.notes);
      }
    });
  }

  useEffect(() => {
      getAllNotes();
  }, []);

  return (
    <ContextView title="Overview">
      <Box css={{ stack: "y" }}>
        <Inline
          css={{
            color: "primary",
            fontWeight: "semibold"
          }}
        >
          View all notes
        </Inline>

        <Notes notes={notes} />
      </Box>
    </ContextView>
  );
};

export default HomeOverview;
