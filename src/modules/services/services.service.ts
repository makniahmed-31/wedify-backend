import { Injectable } from "@nestjs/common";
import {
  CreateServiceDto,
  UpdateServiceDto,
  ServiceResponseDto,
} from "./dto/service.dto";

@Injectable()
export class ServicesService {
  async create(
    _vendorId: string,
    _dto: CreateServiceDto,
  ): Promise<ServiceResponseDto> {
    // TODO: Verify vendor ownership, create service
    throw new Error("Not implemented");
  }

  async findByVendor(_vendorId: string): Promise<ServiceResponseDto[]> {
    // TODO: List all services for a vendor
    throw new Error("Not implemented");
  }

  async findOne(_serviceId: string): Promise<ServiceResponseDto> {
    // TODO: Find service by ID
    throw new Error("Not implemented");
  }

  async update(
    _vendorId: string,
    _serviceId: string,
    _dto: UpdateServiceDto,
  ): Promise<ServiceResponseDto> {
    // TODO: Verify ownership, update service
    throw new Error("Not implemented");
  }

  async remove(_vendorId: string, _serviceId: string): Promise<void> {
    // TODO: Verify ownership, soft-delete service
  }

  async toggleActive(
    _vendorId: string,
    _serviceId: string,
  ): Promise<ServiceResponseDto> {
    // TODO: Toggle isActive flag
    throw new Error("Not implemented");
  }
}
