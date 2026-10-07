import { ApiProperty } from "@nestjs/swagger";
import { TipoMovimiento } from "../../generated/prisma/enums.js";
import { IsEnum, IsInt, IsNumber, Min } from "class-validator";
import { Type } from "class-transformer";

export class MovimientoCajaDto {
    @ApiProperty({
        example:'APERTURA|RETIRO|AJUSTE|INGRESO',
        description:'Escribe el Tipo de Movimiento',
    })
    @IsEnum(TipoMovimiento)
    tipo:TipoMovimiento;

    @ApiProperty({
        example:'1000.00',
        description:'Ingresa El Monto del Movimiento',
    })
    @Type(() => Number)
    @IsNumber({maxDecimalPlaces:2},{message:'El Monto debe ser un Numero con 2 Decimales'})
    monto:number;
}