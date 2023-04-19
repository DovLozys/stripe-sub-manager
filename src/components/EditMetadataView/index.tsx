import { Box, Button, FocusView } from '@stripe/ui-extension-sdk/ui';
import { FunctionComponent } from 'react';

interface EditMetadataViewProps {
  isOpen: boolean;
  onSuccessAction: () => void;
  onCancelAction: () => void;
}

const EditMetadataView: FunctionComponent<EditMetadataViewProps> = ({
  isOpen,
  onSuccessAction,
  onCancelAction,
}: EditMetadataViewProps) => {
  return (
    <FocusView
      title="Edit metadata"
      shown={isOpen}
      primaryAction={
        <Button type="primary" onPress={() => onSuccessAction()}>
          POST Metadata
        </Button>
      }
      secondaryAction={<Button onPress={() => onCancelAction()}>Cancel</Button>}
    >
      <Box>Velcome</Box>
    </FocusView>
  );
};

export default EditMetadataView;
