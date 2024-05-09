import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seeding() {
	await prisma.$transaction([
		prisma.client.createMany({
			data: [
				{ id: 'c1', name: 'Jensen Huang', email: 'jensenh@mail.com' },
				{ id: 'c2', name: 'Alex Grim', email: 'alexgrim@mail.com' },
				{ id: 'c3', name: 'John Morrison', email: 'jm@myco.com' },
				{ id: 'c4', name: 'Alysa Werner', email: 'alysa@email.co.uk' },
				{
					id: 'c5',
					name: 'Mellisa Clarke',
					email: 'mellisa.clarke@example.com',
				},
			],
		}),
		prisma.address.createMany({
			data: [
				{
					id: 'a1',
					street: '19 Union Terrace',
					city: 'London',
					postCode: 'E1 3EZ',
					country: 'United Kingdom',
					isSender: true,
				},
				{
					id: 'a2',
					street: '106 Kendell Street',
					city: 'Sharrington',
					postCode: 'NR24 5WQ',
					country: 'United Kingdom',
					isSender: false,
				},
				{
					id: 'a3',
					street: '84 Church Way',
					city: 'Bradford',
					postCode: 'BD1 9PB',
					country: 'United Kingdom',
					isSender: false,
				},
				{
					id: 'a4',
					street: '79 Dover Road',
					city: 'Westhall',
					postCode: 'IP19 3PF',
					country: 'United Kingdom',
					isSender: false,
				},
				{
					id: 'a5',
					street: '63 Warwick Road',
					city: 'Carlisle',
					postCode: 'CA20 2TG',
					country: 'United Kingdom',
					isSender: false,
				},
				{
					id: 'a6',
					street: '46 Abbey Row',
					city: 'Cambridge',
					postCode: 'CB5 6EG',
					country: 'United Kingdom',
					isSender: false,
				},
			],
		}),
		prisma.invoice.createMany({
			data: [
				{
					id: 'RT3080',
					createdAt: '2021-08-18T00:00:00.000Z',
					paymentDue: '2021-08-19T00:00:00.000Z',
					description: 'Re-branding',
					paymentTerms: 1,
					clientId: 'c1',
					status: 'paid',
					total: 1800.9,
				},
				{
					id: 'XM9141',
					createdAt: '2021-08-21T00:00:00.000Z',
					paymentDue: '2021-09-20T00:00:00.000Z',
					description: 'Graphic Design',
					paymentTerms: 30,
					clientId: 'c2',
					status: 'pending',
					total: 556.0,
				},
				{
					id: 'RG0314',
					createdAt: '2021-09-24T00:00:00.000Z',
					paymentDue: '2021-10-01T00:00:00.000Z',
					description: 'Website Redesign',
					paymentTerms: 7,
					clientId: 'c3',
					status: 'paid',
					total: 14002.33,
				},
				{
					id: 'RT2080',
					createdAt: '2021-10-11T00:00:00.000Z',
					paymentDue: '2021-10-12T00:00:00.000Z',
					description: 'Logo Concept',
					paymentTerms: 1,
					clientId: 'c4',
					status: 'pending',
					total: 102.04,
				},
				{
					id: 'AA1449',
					createdAt: '2021-10-07T00:00:00.000Z',
					paymentDue: '2021-10-14T00:00:00.000Z',
					description: 'Re-branding',
					paymentTerms: 7,
					clientId: 'c5',
					status: 'pending',
					total: 4032.33,
				},
			],
		}),
		prisma.invoiceAddress.createMany({
			data: [
				{ invoiceId: 'RT3080', addressId: 'a2' },
				{ invoiceId: 'XM9141', addressId: 'a3' },
				{ invoiceId: 'RG0314', addressId: 'a4' },
				{ invoiceId: 'RT2080', addressId: 'a5' },
				{ invoiceId: 'AA1449', addressId: 'a6' },
			],
		}),
		prisma.item.createMany({
			data: [
				{
					id: 'it1',
					invoiceId: 'RT3080',
					name: 'Brand Guidelines',
					quantity: 1,
					price: 1800.9,
					total: 1800.9,
				},
				{
					id: 'it2',
					invoiceId: 'XM9141',
					name: 'Banner Design',
					quantity: 1,
					price: 156.0,
					total: 156.0,
				},
				{
					id: 'it3',
					invoiceId: 'XM9141',
					name: 'Email Design',
					quantity: 2,
					price: 200.0,
					total: 400.0,
				},
				{
					id: 'it4',
					invoiceId: 'RG0314',
					name: 'Website Redesign',
					quantity: 1,
					price: 14002.33,
					total: 14002.33,
				},
				{
					id: 'it5',
					invoiceId: 'RT2080',
					name: 'Logo Sketches',
					quantity: 1,
					price: 102.04,
					total: 102.04,
				},
				{
					id: 'it6',
					invoiceId: 'AA1449',
					name: 'New Logo',
					quantity: 1,
					price: 1532.33,
					total: 1532.33,
				},
				{
					id: 'it7',
					invoiceId: 'AA1449',
					name: 'Brand Guidelines',
					quantity: 1,
					price: 2500.0,
					total: 2500.0,
				},
			],
		}),
	]);
}

seeding()
	.then(async () => {
		await prisma.$disconnect();
		console.log('DB seeded successfully!');
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
