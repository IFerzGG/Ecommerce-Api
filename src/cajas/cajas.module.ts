import { Module } from '@nestjs/common';
import { CajasController } from './cajas.controller.js';
import { CajasService } from './cajas.service.js';
import { MovimientoCajaDto } from './dto/movimientoCaja.dto.js';
import { MovCajasService } from './movimientosCaja.service.js';

@Module({
  controllers: [CajasController],
  providers: [CajasService,MovCajasService],
})
export class CajasModule {}
