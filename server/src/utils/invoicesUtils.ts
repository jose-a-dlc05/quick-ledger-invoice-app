export const generateUniqueID = () => {
	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const getRandomLetter = () =>
		letters[Math.floor(Math.random() * letters.length)];
	const getRandomNumber = () => Math.floor(1000 + Math.random() * 9000); // Generates a number from 1000 to 9999

	return `${getRandomLetter()}${getRandomLetter()}${getRandomNumber()}`;
};
