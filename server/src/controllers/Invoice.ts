import InvoiceService from '../services/Invoice';

const invoiceService = new InvoiceService();

export default class InvoiceController {
	getInvoices = async (req: any, res: any) => {
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
			console.error(err);
		}
	};
	getInvoiceById = async (req: any, res: any) => {
		try {
			return res
				.status(200)
				.json(await invoiceService.getInvoiceById(req.params.id));
		} catch (err) {
			console.error(err);
		}
	};
	createInvoice = async (req: any, res: any) => {
		try {
			if (!req.body) {
				return res.status(400).send({ message: 'There is no value' });
			}
			return res.status(201).json(await invoiceService.createInvoice(req.body));
		} catch (err) {
			return res.status(400).send(err);
		}
	};
	updateInvoice = async (req: any, res: any) => {
		try {
			const resourceFound = await invoiceService.getInvoiceById(req.params.id);
			if (!resourceFound) {
				return res.status(404).send('Invoice not found');
			}
			return res.json(
				await invoiceService.updateInvoice(req.body, req.params.id)
			);
		} catch (err) {
			return res.send(err);
		}
	};
	deleteInvoice = async (req: any, res: any) => {
		try {
			const resourceFound = await invoiceService.getInvoiceById(req.params.id);
			if (!resourceFound) {
				return res.status(404).send('Invoice not found');
			}
			return res.json(await invoiceService.deleteInvoice(req.params.id));
		} catch (err) {
			return res.send(err);
		}
	};
}
