export interface InvoiceInt {
	id: string;
	createdAt: Date;
	paymentDue: Date;
	description: string;
	paymentTerms: number;
	clientId: string;
	status: string;
	total: number;
	senderAddressId: string;
	clientAddressId: string;
}
