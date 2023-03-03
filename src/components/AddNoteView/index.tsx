import { Button, FocusView, TextArea } from '@stripe/ui-extension-sdk/ui';
import { FunctionComponent, useState } from 'react';
import { addNote } from '../../api';

interface AddNoteViewProps {
  isOpen: boolean;
  customerId: string;
  staffId: string;
  onSuccessAction: () => void;
  onCancelAction: () => void;
}

const AddNoteView: FunctionComponent<AddNoteViewProps> = ({
  isOpen,
  customerId,
  staffId,
  onSuccessAction,
  onCancelAction,
}: AddNoteViewProps) => {
  const [message, setMessage] = useState<string>('');

  return (
    <FocusView
      title="Add a new note"
      shown={isOpen}
      onClose={() => {
        onCancelAction();
      }}
      primaryAction={
        <Button
          type="primary"
          onPress={async () => {
            await addNote({ customerId, message, staffId });
            setMessage('');
            onSuccessAction();
          }}
        >
          Save note
        </Button>
      }
      secondaryAction={
        <Button
          onPress={() => {
            onCancelAction();
          }}
        >
          Cancel
        </Button>
      }
    >
      <TextArea
        label="message"
        placeholder="Note..."
        value={message}
        autoFocus
        onChange={(e) => {
          setMessage(e.target.value);
        }}
      />
    </FocusView>
  );
};

export default AddNoteView;
