interface InvoiceAddress {
	street: string;
	city: string;
	postCode: string;
	country: string;
	isSender: boolean;
}

interface InvoiceItems {
	name: string;
	quantity: number;
	price: number;
	total: number;
}

export interface InvoiceInt {
	clientName: string;
	clientEmail: string;
	senderAddress: InvoiceAddress;
	clientAddress: InvoiceAddress;
	paymentDue: Date;
	paymentTerms: number;
	description: string;
	items: InvoiceItems[];
}
