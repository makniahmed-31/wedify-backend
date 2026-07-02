import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AdminSecretGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    // Require ADMIN role from validated JWT (set by JwtAuthGuard)
    const user = req.user;
    if (!user || user.role !== "ADMIN") {
      throw new ForbiddenException("Admin role required");
    }

    // Additionally validate admin secret header if configured
    const expected = this.config.get<string>("ADMIN_SECRET");
    if (expected) {
      const provided = req.headers["x-admin-secret"] as string | undefined;
      if (provided !== expected) {
        throw new UnauthorizedException("Invalid admin secret");
      }
    }

    return true;
  }
}
