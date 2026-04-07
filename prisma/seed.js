const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Si ya existe data, evitamos duplicar (por email unique)
  const count = await prisma.usuario.count();
  if (count > 0) {
    console.log(`Seed omitido: ya existen ${count} usuarios.`);
    return;
  }

  await prisma.usuario.createMany({
    data: [
      { nombre: "Ana Torres", email: "ana.torres@demo.com", edad: 21 },
      { nombre: "Bruno Diaz", email: "bruno.diaz@demo.com", edad: 28 },
      { nombre: "Carla Rojas", email: "carla.rojas@demo.com", edad: 24 },
      { nombre: "Diego Perez", email: "diego.perez@demo.com", edad: 31 },
      { nombre: "Elena Vargas", email: "elena.vargas@demo.com", edad: 26 }
    ]
  });

  console.log("Seed OK: 5 usuarios insertados.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

