import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default class AuthController {
	getUsers = async (req: any, res: any) => {
		try {
			return await res.status(200).json({
				success: true,
				data: await prisma.user.findMany(),
			});
		} catch (err) {
			console.error(err);
		}
	};
}
