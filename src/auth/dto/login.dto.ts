import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginAuthDto {
    @ApiProperty({
        example:'user@tienda.com',
        description:'Ingresar el Email Correctamente',
    })
    @IsEmail({require_tld:true},{message:'El Email Debe Tener el Formato Correcto'})
    @IsNotEmpty({message:'El Email es Obligatrio'})
    @IsEmail({},{message:'El Email Debe Tener el Formato Correcto'})
    @IsNotEmpty({message:'El Email Es Obligatorio'})
    email: string;

    @ApiProperty({
        example:'123456',
        description:'Ingresar Nueva Contraseña',
    })
    @IsString({message:'El Password Debe Ser Una Cadena de Texto'})
    @Transform(({value}) => value?.trim())
    @IsNotEmpty({message:'El Password Es Obligatorio'})
    @MinLength(6,{message:'EL Password Debe Tener 6 Caracteres'})
    password: string;
}