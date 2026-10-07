import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsEnum, IsInt, Min, ValidateNested } from "class-validator";
import { TipoPago } from "../../generated/prisma/enums.js";

export class VentaProductoDto{
    @Type(() => Number)
    @IsInt({message:'El ProductoId Debe ser un Numero Entero'})
    @Min(1,{message:'El ProductoId Debe Ser Un Numero Positivo'})
    productoId:number;
    
    @Type(() => Number)
    @IsInt({message:'La Cantidad Debe ser un Numero Entero'})
    @Min(1,{message:'La Cantidad Debe Ser Un Numero Positivo'})
    cantidad:number;
}
export class CreateVentaDto{
    @IsEnum(TipoPago,{message:'El Tipo de Pago debe ser EFECTIVO|TARJETA'})
    metodoPago:TipoPago;

    @IsArray()
    @ArrayMinSize(1,{message:'No puedes mandar un Array Vacio'})
    @ValidateNested({each:true})
    @Type(() => VentaProductoDto)
    ventaProductos: VentaProductoDto[];
}