import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login.dto.js';
import bcrypt from 'bcrypt';
import { RegisterAuthDto } from './dto/register.dto.js';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService:JwtService,
    ){}

    async validateUser(email:string, password:string){
        const user = await this.userService.findByEmail(email);
        if(user && (await bcrypt.compare(password,user.password))) {
            const {password, ...dataUser} = user;
            return dataUser;
        }
        return null;
    }

    async login(user:any){
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        return { access_token: this.jwtService.sign(payload) };
    }

    async register(data:RegisterAuthDto){
        return await this.userService.create(data);
    }
}
