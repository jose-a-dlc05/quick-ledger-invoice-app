import { PrismaClient } from '@prisma/client';
import { InvoiceInt } from '../utils/interfaces';
import { generateUniqueID } from '../utils/invoicesUtils';
import { toISODateString } from '../utils/dateManipulator';

const prisma = new PrismaClient();
export default class InvoiceDAO {
	getInvoices = async () => {
		try {
			return await prisma.invoice.findMany({
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

	getInvoiceById = async (id: string) => {
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
			console.error(err);
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
			let client = await prisma.client.findUnique({
				where: {
					email: postData.clientEmail,
				},
			});

			if (!client) {
				client = await prisma.client.create({
					data: { name: postData.clientName, email: postData.clientEmail },
				});
			}

			const senderAddressCreated = await prisma.address.create({
				data: { ...postData.senderAddress },
			});

			const clientAddressCreated = await prisma.address.create({
				data: { ...postData.clientAddress },
			});
			return await prisma.invoice.create({
				data: {
					id: generateUniqueID(),
					paymentDue: postData.paymentDue,
					paymentTerms: postData.paymentTerms,
					description: postData.description,
					clientId: client.id,
					status: 'pending',
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

	updateInvoice = async (data: InvoiceInt, id: string) => {
		try {
			// return await prisma.invoice.update({
			// 	where: { id },
			// 	data,
			// });
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
