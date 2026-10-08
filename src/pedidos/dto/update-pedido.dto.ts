import { IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { EstadoPedido } from "../../generated/prisma/enums.js";
import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";

export class UpdatePedidoDto {
    @IsOptional()
    @IsEnum(EstadoPedido,{message:'El EstadoPeidido puede ser EN_PROCESO|ENVIADO|ENTREGADO|CANCELADO'})
    estado:EstadoPedido;

    @IsOptional()
    @Type(() => Number)
    @IsInt({message:'La DireccionId Debe ser un Numero Entero'})
    @Min(1,{message:'La DireccionId Debe Ser Un Numero Positivo'})
    direccionId:number;
}