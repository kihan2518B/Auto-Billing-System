// import { PrismaClient } from "@prisma/client"

// const prisma = new PrismaClient()

// export default prisma

// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Singleton pattern for Prisma client
let prisma: PrismaClient;

declare const global: NodeJS.Global & { prisma?: PrismaClient };

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    if (global.prisma) {
        console.log("global.prisma: ");

        prisma = global.prisma;
    } else {
        prisma = new PrismaClient();
        console.log("prisma: ");
        global.prisma = prisma;
    }
}

export default prisma;
