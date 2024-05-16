import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

interface UserInt {
	id: string;
	name: string;
	email: string;
	role: Role;
	password: string;
}

export const hashUserPasswords = async (users: UserInt[], saltRounds = 10) => {
	return Promise.all(
		users.map(async (user: UserInt) => {
			const hashedPassword = await bcrypt.hash(user.password, saltRounds);
			return { ...user, password: hashedPassword };
		})
	);
};
