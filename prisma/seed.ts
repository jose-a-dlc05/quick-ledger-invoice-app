import { PrismaClient, Role } from '@prisma/client';
import fs from 'fs';
import { hashUserPasswords } from '../server/src/utils/authUtils';
import colors from 'colors';
import path from 'path';
const prisma = new PrismaClient();
const dataDirectory = path.join(__dirname, '../_data');

const users = JSON.parse(
	fs.readFileSync(`${dataDirectory}/users.json`, `utf-8`)
);
const item = JSON.parse(fs.readFileSync(`${dataDirectory}/item.json`, `utf-8`));
const invoiceAddress = JSON.parse(
	fs.readFileSync(`${dataDirectory}/invoiceAddress.json`, `utf-8`)
);
const invoice = JSON.parse(
	fs.readFileSync(`${dataDirectory}/invoice.json`, `utf-8`)
);
const address = JSON.parse(
	fs.readFileSync(`${dataDirectory}/address.json`, `utf-8`)
);
const clients = JSON.parse(
	fs.readFileSync(`${dataDirectory}/clients.json`, `utf-8`)
);
const hashedUsers = hashUserPasswords(users);
async function seeding() {
	await prisma.$transaction(async (transaction) => {
		await transaction.user.createMany({
			data: await hashedUsers,
		});
		await transaction.client.createMany({
			data: clients,
		}),
			await transaction.address.createMany({
				data: address,
			});
		await transaction.invoice.createMany({
			data: invoice,
		}),
			await transaction.item.createMany({
				data: item,
			});
		await transaction.invoiceAddress.createMany({
			data: invoiceAddress,
		});
	});
}

async function deleteData() {
	await prisma.$transaction([
		prisma.invoiceAddress.deleteMany(),
		prisma.user.deleteMany(),
		prisma.address.deleteMany(),
		prisma.client.deleteMany(),
		prisma.item.deleteMany(),
		prisma.invoice.deleteMany(),
	]);
}

if (process.argv[2] === '-i') {
	seeding()
		.then(async () => {
			await prisma.$disconnect();
			console.log('Data imported...!');
		})
		.catch(async (e) => {
			console.error(e);
			await prisma.$disconnect();
			process.exit(1);
		});
} else if (process.argv[2] === '-d') {
	deleteData()
		.then(async () => {
			await prisma.$disconnect();
			console.log('Data Destroyed...!');
		})
		.catch(async (e) => {
			console.error(e);
			await prisma.$disconnect();
			process.exit(1);
		});
}
