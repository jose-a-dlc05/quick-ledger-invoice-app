import { PrismaClient } from '@prisma/client';
import { InvoiceInt } from '../utils/interfaces';
import { toISODateString } from '../utils/dateManipulator';

const prisma = new PrismaClient();
export default class InvoiceDAO {
	getInvoices = async () => {
		try {
			return await prisma.invoice.findMany();
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
			paymentDue: toISODateString(data.paymentDue),
			paymentTerms: data.paymentTerms,
		};

		try {
			return await prisma.invoice.create({ data: postData });
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
			return await prisma.invoice.update({
				where: { id },
				data,
			});
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
