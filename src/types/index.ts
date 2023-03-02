export interface Note {
    id: number;
    staffId: string;
    customerId: string;
    message: string;
    createdAt: Date;
}

export interface APIResponse {
    data: any;
    error: boolean;
}
