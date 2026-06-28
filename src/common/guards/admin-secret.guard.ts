import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AdminSecretGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const secret = req.headers["x-admin-secret"];
    const expected = this.config.get<string>("ADMIN_SECRET");
    if (!expected || secret !== expected) {
      throw new UnauthorizedException("Invalid admin secret");
    }
    return true;
  }
}
