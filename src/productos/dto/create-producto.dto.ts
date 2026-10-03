import { Transform, Type } from "class-transformer";
import { IsString, IsNotEmpty, IsNumber, IsPositive, IsInt, Min, IsDefined } from "class-validator";

export class CreateProductoDto {
    @IsString({message:"El nombre es una Cadena de Texto"})
    @Transform(({value}) => value?.trim())
    @IsNotEmpty({message:'El Nombre es Obligatrio'})
    nombre:string;
    
    @Type(() => Number)
    @IsDefined({ message: "El PrecioCompra es obligatorio" })
    @IsNumber({maxDecimalPlaces:2},{message:'El PrecioCompra Debe Tener 2 Decimales'})
    @IsPositive({message:'El PrecioCompra Debe Ser Positivo'})
    precioCompra:number;

    @Type(() => Number)
    @IsDefined({ message: "El PrecioVenta es obligatorio" })
    @IsNumber({maxDecimalPlaces:2},{message:'El PrecioVenta Debe Tener 2 Decimales'})
    @IsPositive({message:'El PrecioVenta Debe Ser Positivo'})
    precioVenta:number;

    @Type(() => Number)
    @IsDefined({message:'El Stock es Obligatorio'})
    @IsInt({message:'El Stock Debe Ser Un Numero Entero'})
    @Min(0,{message:'El Stock No Puede Ser Negativo'})
    stock:number;

    @Type(() => Number)
    @IsDefined({message:'La CategoriaID es Obligatorio'})
    @IsInt({message:'La CategoriaID Debe Ser Un Numero Entero'})
    @Min(1,{message:'La CategoriaID No Puede Ser Negativo'})
    categoriaId:number;
}