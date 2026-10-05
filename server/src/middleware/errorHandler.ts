import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('❌ Server Error:', err);

  if (err instanceof ZodError) {
    const issues = err.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(', ');
    return res.status(400).json({
      success: false,
      error: `Validation error: ${issues}`,
      details: err.issues,
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized access',
    });
  }

  const status = err.statusCode || err.status || 500;
  const message = err.message || 'An unexpected internal server error occurred';

  res.status(status).json({
    success: false,
    error: message,
  });
}
