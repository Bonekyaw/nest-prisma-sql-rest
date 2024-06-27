import { PrismaClient, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const adminData: Prisma.AdminCreateInput[] = [
  {
    name: 'Phone Nyo',
    phone: '09778661260',
    password: '',
    randToken: 'xirj1izi88iisvh0mt6lr9efseef45frt',
  },
  {
    name: 'Ko Nay',
    phone: '09778661261',
    password: '',
    randToken: 'xirj1izi88iisvh0mt6lr9efseef45frt',
  },
  {
    name: 'Paing Gyi',
    phone: '09778661262',
    password: '',
    randToken: 'xirj1izi88iisvh0mt6lr9efseef45frt',
  },
  {
    name: 'Jue Jue',
    phone: '09778661263',
    password: '',
    randToken: 'xirj1izi88iisvh0mt6lr9efseef45frt',
  },
  {
    name: 'Nant Su',
    phone: '09778661264',
    password: '',
    randToken: 'xirj1izi88iisvh0mt6lr9efseef45frt',
  },
];

async function main() {
  console.log(`Start seeding ...`);
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash('12345678', salt);
  for (const a of adminData) {
    a.password = password;
    const admin = await prisma.admin.create({
      data: a,
    });
    console.log(`Created admin with id: ${admin.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
