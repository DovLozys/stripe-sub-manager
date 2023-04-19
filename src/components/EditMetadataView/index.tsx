import { Box, Button, FocusView, TextField } from '@stripe/ui-extension-sdk/ui';
import { FunctionComponent } from 'react';
import Stripe from 'stripe';

interface EditMetadataViewProps {
  isOpen: boolean;
  metadata: Stripe.Metadata;
  onSuccessAction: () => void;
  onCancelAction: () => void;
  editMetadata: (editedMetadata: Stripe.Metadata) => void;
}

const EditMetadataView: FunctionComponent<EditMetadataViewProps> = ({
  isOpen,
  metadata,
  onSuccessAction,
  onCancelAction,
  editMetadata,
}: EditMetadataViewProps) => {
  return (
    <FocusView
      title="Edit metadata"
      shown={isOpen}
      primaryAction={
        <Button
          type="primary"
          onPress={() => {
            editMetadata(metadata);
            onSuccessAction();
          }}
        >
          POST Metadata
        </Button>
      }
      secondaryAction={<Button onPress={() => onCancelAction()}>Cancel</Button>}
    >
      <Box>
        Velcome
        {Object.entries(metadata).map(([key, value]) => {
          return (
            <TextField
              label={key}
              defaultValue={value}
              onChange={(e) => {
                metadata[key] = e.target.value;
              }}
            ></TextField>
          );
        })}
      </Box>
    </FocusView>
  );
};

export default EditMetadataView;
