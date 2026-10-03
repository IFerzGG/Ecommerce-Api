import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterAuthDto {
    @IsString({message:"El nombre es una Cadena de Texto"})
    @Transform(({value}) => value?.trim())
    @IsNotEmpty({message:'El Nombre es Obligatrio'})
    nombre:string;

    @IsEmail({require_tld:true},{message:'El Email Debe Tener el Formato Correcto'})
    @IsNotEmpty({message:'El Email es Obligatrio'})
    email:string;

    @IsString({message:"El Password es una Cadena de Texto"})
    @Transform(({value}) => value?.trim())
    @IsNotEmpty({message:'El Password es Obligatrio'})
    @MinLength(6,{message:"El Password debe tener minimo 6 caracteres"})
    password:string;

}