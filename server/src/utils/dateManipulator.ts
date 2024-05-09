export const formatDate = (date: Date) => {
	const d = new Date(date + 'T00:00:00Z');
	const year = d.getUTCFullYear();
	const month = (d.getUTCMonth() + 1).toString().padStart(2, '0');
	const day = d.getUTCDate().toString().padStart(2, '0');
	const formattedDate = `${year}-${month}-${day} 00:00:00`;
	return formattedDate;
};

export const toISODateString = (dateInput: Date) => {
	// Check if dateInput is already a Date object
	if (dateInput instanceof Date) {
		return dateInput.toISOString();
	}
	// Attempt to convert it to a Date object if it's not
	try {
		const date = new Date(dateInput);
		if (!isNaN(date.getTime())) {
			// Check if date is valid
			return date.toISOString();
		}
		throw new Error('Invalid date');
	} catch (error) {
		console.error('Failed to convert date:', error);
		throw error; // Rethrow or handle error appropriately
	}
};
