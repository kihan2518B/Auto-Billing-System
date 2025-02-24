// global.d.ts (or any .d.ts file)
declare global {
    namespace NodeJS {
      interface Global {
        prisma: import('@prisma/client').PrismaClient;  // Type PrismaClient correctly
      }
    }
  }
  
  export {}; // To make this a module and augment the global namespace
  