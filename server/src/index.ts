import express from 'express';
import cors from 'cors';
import './lib/env';

// This is the point of entry
const app: express.Express = express();
app.use(cors());

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
	);
});

export default app;
