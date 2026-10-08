import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main(){
    console.log('==========================================');
    console.log('INICIANDO SEED DE PRUEBAS');
    console.log('==========================================');
    const passwordHash = await bcrypt.hash('Password123!', 10);

    const admin = await prisma.user.create({
        data:{
            nombre:'ADMIN',
            email:'admin@tienda.com',
            password:passwordHash,
            role:'ADMIN',
        },
    });

    const caja = await prisma.user.create({
        data:{
            nombre:'CAJA',
            email:'caja@tienda.com',
            password:passwordHash,
            role:'CAJA',
        },
    });

    const cliente = await prisma.user.create({
        data:{
            nombre:'CLIENTE',
            email:'cliente@tienda.com',
            password:passwordHash,
            role:'CLIENT',
        },
    });

    console.log('✅ Seed terminado');
}

main()
    .catch((error) => {
        console.error('');
        console.error('ERROR EJECUTANDO EL SEED:', error);
        process.exit(1);
    })
    .finally(async() => {
        await prisma.$disconnect();
        await pool.end();
    });