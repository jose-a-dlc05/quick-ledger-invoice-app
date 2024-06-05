import InvoiceService from '../services/Invoice';
import { ErrorResponse } from '../utils/errorResponse';

const invoiceService = new InvoiceService();

export default class InvoiceController {
	getInvoices = async (req: any, res: any, next: any) => {
		const { status } = req.query;
		try {
			if (status) {
				const invoices = await invoiceService.getInvoices(status);
				return await res.status(200).json({
					success: true,
					count: invoices?.length,
					data: invoices,
				});
			}
			const invoices = await invoiceService.getInvoices();
			return await res.status(200).json({
				success: true,
				count: invoices?.length,
				data: invoices,
			});
		} catch (err) {
			next(err);
		}
	};
	getInvoiceById = async (req: any, res: any, next: any) => {
		return res
			.status(200)
			.json(await invoiceService.getInvoiceById(req.params.id, next));
	};
	createInvoice = async (req: any, res: any, next: any) => {
		try {
			if (!req.body) {
				return res.status(400).send({ message: 'There is no value' });
			}
			return res.status(201).json(await invoiceService.createInvoice(req.body));
		} catch (err) {
			return res.status(400).send(err);
		}
	};
	updateInvoice = async (req: any, res: any, next: any) => {
		try {
			const resourceFound = await invoiceService.getInvoiceById(
				req.params.id,
				next
			);
			if (!resourceFound) {
				return next(
					new ErrorResponse(`Invoice ${req.params.id} not found`, 404)
				);
			}
			return res.json(
				await invoiceService.updateInvoice(req.body, req.params.id)
			);
		} catch (err) {
			next(err);
		}
	};
	deleteInvoice = async (req: any, res: any, next: any) => {
		try {
			const resourceFound = await invoiceService.getInvoiceById(
				req.params.id,
				next
			);
			if (!resourceFound) {
				return next(
					new ErrorResponse(`Invoice ${req.params.id} not found`, 404)
				);
			}
			return res.json(await invoiceService.deleteInvoice(req.params.id));
		} catch (err) {
			next(err);
		}
	};
}
