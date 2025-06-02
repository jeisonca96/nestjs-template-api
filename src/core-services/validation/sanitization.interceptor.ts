import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SanitizationUtils } from './validation.utils';

/**
 * Interceptor to automatically sanitize request data
 */
@Injectable()
export class SanitizationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    try {
      // Sanitize request body (only if it exists and is mutable)
      if (request.body && typeof request.body === 'object') {
        request.body = SanitizationUtils.sanitizeInput(request.body);
      }

      // Sanitize query parameters (create new object to avoid mutation issues)
      if (request.query && typeof request.query === 'object') {
        const sanitizedQuery = SanitizationUtils.sanitizeInput(request.query);
        // Only update if query is mutable
        if (Object.isExtensible(request.query)) {
          Object.assign(request.query, sanitizedQuery);
        }
      }

      // Sanitize route parameters (create new object to avoid mutation issues)
      if (request.params && typeof request.params === 'object') {
        const sanitizedParams = SanitizationUtils.sanitizeInput(request.params);
        // Only update if params is mutable
        if (Object.isExtensible(request.params)) {
          Object.assign(request.params, sanitizedParams);
        }
      }
    } catch (error) {
      // Log error but don't break the request flow
      console.warn('Sanitization interceptor error:', error.message);
    }

    return next.handle().pipe(
      map((data) => {
        // Optionally sanitize response data as well
        return data;
      }),
    );
  }
}
