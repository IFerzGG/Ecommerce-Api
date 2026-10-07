import { PartialType } from "@nestjs/swagger";
import { CreateCajaDto } from "./create-caja.dto.js";
import { MovimientoCajaDto } from "./movimientoCaja.dto.js";

export class UpdateCajaDto extends PartialType(CreateCajaDto){}
export class UpdateMovCajaDto extends PartialType(MovimientoCajaDto){}