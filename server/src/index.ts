import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import './lib/env';
import invoices from './routes/Invoice';

const app: express.Express = express();
app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.use('/api/v1/invoices', invoices);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
	);
});

export default app;
