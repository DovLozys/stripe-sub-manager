import { APIResponse, Note } from '../types';

const notes: Note[] = [
    {
        id: 1,
        staffId: "acct_",
        customerId: "cus_M9DfDw7rWL4mMV",
        message: "needs confirmation",
        createdAt: new Date(),
    },
    {
        id: 2,
        staffId: "acct_",
        customerId: "cus_M9DfDw7rWL4mMV", 
        message: "call scheduled for 2pm",
        createdAt: new Date(),
    },
];

const generateRandomId = (): number => {
    return Math.floor(Math.random() * 100);
};

export async function addNote({
    customerId,
    message,
    staffId
}: {
    customerId: string,
    message: string,
    staffId: string
}): Promise<APIResponse> {
    const newNote: Note = {
        id: generateRandomId(),
        staffId,
        customerId,
        message,
        createdAt: new Date()
    }
    notes.push(newNote);

    const response: APIResponse = {
        error: false,
        data: {}
    }
    return Promise.resolve(response);
}

export async function getAllNotes(): Promise<APIResponse> {
    const response: APIResponse = {
        error: false,
        data: {
            notes
        }
    }
    return Promise.resolve(response)
}

export async function getNotesForCustomer({ 
    customerId
}: {
    customerId: string
}): Promise<APIResponse> {
    const notesForCustomer = notes.filter(
        (record: Note) => record.customerId === customerId
    );
    const response: APIResponse = {
        error: false,
        data: {
            notesForCustomer
        }
    };

    return Promise.resolve(response);
}
