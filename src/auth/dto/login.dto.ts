import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginAuthDto {
    @IsEmail({},{message:'El Email Debe Tener el Formato Correcto'})
    @IsNotEmpty({message:'El Email Es Obligatorio'})
    email: string;

    @IsString({message:'El Password Debe Ser Una Cadena de Texto'})
    @Transform(({value}) => value?.trim())
    @IsNotEmpty({message:'El Password Es Obligatorio'})
    @MinLength(6,{message:'EL Password Debe Tener 6 Caracteres'})
    password: string;
}