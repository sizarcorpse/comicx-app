import { Express, NextFunction, Request, Response } from 'express'; 
 
export const tagService = { 
	async sample(req: Request, res: Response, next: NextFunction) { 
		// code here 
		try { 
		} catch (error) { 
			res 
		.status(400) 
		.json({ status: 'NOT_OK', message: 'Something went wrong' }); 
		} 
	}, 
};
