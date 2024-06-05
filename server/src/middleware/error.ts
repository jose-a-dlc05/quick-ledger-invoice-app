import { ErrorResponse } from '../utils/errorResponse';

export const errorHandler = (err: any, req: any, res: any, next: any) => {
	let error = { ...err };
	error.message = error.err.message;

	// log to console for dev
	console.log(JSON.parse(JSON.stringify(err)));

	if (error.err.name === 'NotFoundError') {
		const message = `Invoice ${error.id} not found`;
		error = new ErrorResponse(message, 404);
	}
	res.status(error.statusCode || 500).json({
		success: false,
		err: error.message || 'Server Error',
	});
};
