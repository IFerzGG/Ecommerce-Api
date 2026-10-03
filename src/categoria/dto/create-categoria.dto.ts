import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoriaDto {
    
    @IsString({message:'El Nombre Debe Ser Una Cadena de Texto'})
    @Transform(({value}) => value?.trim())
    @IsNotEmpty({message:'El Nombre Es Obligatorio'})
    nombre:string;

    @IsOptional()
    @IsString({message:'El Nombre Debe Ser Una Cadena de Texto'})
    descripcion?:string;
}