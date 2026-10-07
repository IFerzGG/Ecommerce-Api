import { ApiProperty } from "@nestjs/swagger";
import { EstadoCaja } from "../../generated/prisma/enums.js";
import { Type } from "class-transformer";
import { IsDate, IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, Matches, Min } from "class-validator";

export class CreateCajaDto {
    @ApiProperty({
        example:'1000.00',
        description:'Ingresa el Monto Inicial de la Caja',
    })
    @IsNotEmpty({message:'El Monto Apertura es Obligatorio'})
    @Type(() => Number)
    @IsNumber({maxDecimalPlaces:2},{message:'El Monto Apertura debe ser Numero Entero con 2 Decimales'})
    @Min(0,{message:'El Monto Apertura debe ser Positivo'})
    montoApertura:number;
    
    @ApiProperty({
        example:'1999-10-04T18:30',
        description:'Introduce la Hora del Cierre y la Fecha de Caja',
    })
    @IsOptional()
    @Type(() => Date)
    @IsDate({message:'Debe ser el Formato Adecuado'})
    fechaCierre?:Date;

    @ApiProperty({
        example:'1000.00',
        description:'Ingresa el Monto Final de la Caja',
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber({maxDecimalPlaces:2},{message:'El Monto Apertura debe ser Numero Entero con 2 Decimales'})
    @Min(0,{message:'El Monto Apertura debe ser Positivo'})
    montoCierre?:number;

    @ApiProperty({
        example:'ABIERTA|CERRADA',
        description:'Escribe el Estado de la Caja',
    })
    @IsOptional()
    @IsEnum(EstadoCaja)
    estado?:EstadoCaja;
}