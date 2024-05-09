import express from 'express';
const router = express.Router();
import InvoiceController from '../controllers/Invoice';

const invoiceController = new InvoiceController();

router
	.route('/')
	.get(invoiceController.getInvoices)
	.post(invoiceController.createInvoice);

router
	.route('/:id')
	.get(invoiceController.getInvoiceById)
	.patch(invoiceController.updateInvoice)
	.delete(invoiceController.deleteInvoice);

export default router;
