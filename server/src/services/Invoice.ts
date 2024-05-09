import InvoiceDAO from '../dao/Invoice';
import { InvoiceInt } from '../utils/interfaces';
import { formatDate } from '../utils/dateManipulator';

const invoiceDao = new InvoiceDAO();

export default class InvoiceService {
	getInvoices = async () => {
		try {
			return await invoiceDao.getInvoices();
		} catch (err) {
			console.error();
		}
	};
	getInvoiceById = async (id: string) => {
		try {
			return await invoiceDao.getInvoiceById(id);
		} catch (err) {
			console.error(err);
		}
	};
	createInvoice = async (data: InvoiceInt) => {
		try {
			return await invoiceDao.createInvoice({
				...data,
				paymentDue: formatDate(data.paymentDue) as unknown as Date,
			});
		} catch (err) {
			console.error(err);
		}
	};
	updateInvoice = async (data: InvoiceInt, id: string) => {
		try {
			return await invoiceDao.updateInvoice(data, id);
		} catch (err) {
			console.error(err);
		}
	};
	deleteInvoice = async (id: string) => {
		try {
			return await invoiceDao.deleteInvoice(id);
		} catch (err) {
			console.error(err);
		}
	};
}
