import { PrismaClient, Prisma } from '@prisma/client';
import { InvoiceInt } from '../utils/interfaces';
import { generateUniqueID } from '../utils/invoicesUtils';
import { toISODateString } from '../utils/dateManipulator';
import { ErrorResponse } from '../utils/errorResponse';

const createOrGetAddress = async (addressDetails: any) => {
	const { street, city, postCode, country } = addressDetails;

	let address = await prisma.address.findFirst({
		where: {
			street,
			city,
			postCode,
			country,
		},
	});

	if (!address) {
		address = await prisma.address.create({
			data: addressDetails,
		});
	}

	return address;
};

const prisma = new PrismaClient();
export default class InvoiceDAO {
	getInvoices = async (status?: Prisma.EnumStatusFilter<'Invoice'>) => {
		try {
			return await prisma.invoice.findMany({
				where: { status },
				select: {
					id: true,
					paymentDue: true,
					client: {
						select: {
							name: true,
						},
					},
					total: true,
					status: true,
				},
			});
		} catch (err) {
			console.error(err);
			await prisma.$disconnect();
		} finally {
			await prisma.$disconnect();
		}
	};

	getInvoiceById = async (id: string, next: any) => {
		try {
			return await prisma.invoice.findUniqueOrThrow({
				where: { id },
				include: {
					client: {
						select: {
							name: true,
							email: true,
						},
					},
					senderAddress: true,
					clientAddress: true,
					items: true,
				},
			});
		} catch (err) {
			let error = { err, id };
			next(error);
			await prisma.$disconnect();
			process.exit(1);
		} finally {
			await prisma.$disconnect();
		}
	};

	createInvoice = async (data: InvoiceInt) => {
		const postData = {
			...data,
			id: generateUniqueID(),
			paymentDue: toISODateString(data.paymentDue),
			paymentTerms: data.paymentTerms,
		};

		try {
			const client = await prisma.client.upsert({
				where: { email: postData.clientEmail },
				update: {
					name: postData.clientName,
				},
				create: {
					email: postData.clientEmail,
					name: postData.clientName,
				},
			});

			const senderAddressCreated = await createOrGetAddress(
				postData.senderAddress
			);

			const clientAddressCreated = await createOrGetAddress(
				postData.clientAddress
			);

			return await prisma.invoice.create({
				data: {
					id: generateUniqueID(),
					paymentDue: postData.paymentDue,
					paymentTerms: postData.paymentTerms,
					description: postData.description,
					clientId: client.id,
					senderAddressId: senderAddressCreated.id,
					clientAddressId: clientAddressCreated.id,
					total: postData.items.reduce((sum, item) => sum + item.total, 0),
					items: {
						create: postData.items,
					},
				},
				include: {
					items: true,
					client: true,
					senderAddress: true,
					clientAddress: true,
				},
			});
		} catch (err) {
			console.error(err);
			await prisma.$disconnect();
			process.exit(1);
		} finally {
			await prisma.$disconnect();
		}
	};

	updateInvoice = async (invoiceData: any, id: string) => {
		const {
			paymentDue,
			description,
			paymentTerms,
			createdAt,
			status,
			client,
			senderAddress,
			clientAddress,
			items,
		} = invoiceData;

		const calculatedTotal = items.reduce(
			(sum: number, item: any) => sum + item.total,
			0
		);
		try {
			const updatedInvoice = await prisma.$transaction(async (prisma) => {
				if (client) {
					await prisma.client.upsert({
						where: { email: client.email },
						update: { name: client.name, email: client.email },
						create: { ...client },
					});
				}
				if (senderAddress) {
					await prisma.address.update({
						where: { id: senderAddress.id },
						data: {
							street: senderAddress.street,
							city: senderAddress.city,
							postCode: senderAddress.postCode,
							country: senderAddress.country,
						},
					});
				}
				if (clientAddress) {
					await prisma.address.update({
						where: { id: clientAddress.id },
						data: {
							street: clientAddress.street,
							city: clientAddress.city,
							postCode: clientAddress.postCode,
							country: clientAddress.country,
						},
					});
				}
				return await prisma.invoice.update({
					where: { id },
					data: {
						paymentDue: toISODateString(paymentDue),
						createdAt,
						description,
						paymentTerms,
						status,
						total: calculatedTotal,
						client: { connect: { email: client.email } },
						senderAddress: { connect: { id: senderAddress.id } },
						clientAddress: { connect: { id: clientAddress.id } },
						items: {
							upsert: items.map((item: any) => ({
								where: { id: item.id },
								update: {
									name: item.name,
									quantity: item.quantity,
									price: item.price,
									total: item.price * item.quantity,
								},
								create: {
									id: item.id,
									name: item.name,
									quantity: item.quantity,
									price: item.price,
									total: item.price * item.quantity,
								},
							})),
						},
					},
					include: {
						items: true,
						client: true,
						senderAddress: true,
						clientAddress: true,
					},
				});
			});
			return updatedInvoice;
		} catch (err) {
			console.error(err);
			await prisma.$disconnect();
			process.exit(1);
		} finally {
			await prisma.$disconnect();
		}
	};

	deleteInvoice = async (id: string) => {
		try {
			return await prisma.invoice.delete({
				where: { id },
			});
		} catch (err) {
			console.error(err);
			await prisma.$disconnect();
			process.exit(1);
		} finally {
			await prisma.$disconnect();
		}
	};
}
