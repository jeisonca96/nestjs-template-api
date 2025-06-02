import { Module, Global } from '@nestjs/common';
import { SanitizationInterceptor } from './sanitization.interceptor';

@Global()
@Module({
  providers: [SanitizationInterceptor],
  exports: [SanitizationInterceptor],
})
export class ValidationModule {}
