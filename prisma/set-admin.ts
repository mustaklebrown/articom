import "dotenv/config";
import { auth } from "../src/lib/auth";
import { prisma } from "../src/lib/prisma";

async function main() {
  const email = "admin@komo-art.km";
  const password = "AdminPassword2026!";

  // 1. Vérifier si l'utilisateur existe
  let user = await prisma.user.findUnique({ where: { email } });

  const ctx = await (auth as any).$context;
  const hashedPassword = await ctx.password.hash(password);

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: "Direction KOMO-ART",
        email,
        role: "SUPER_ADMIN",
        emailVerified: true,
        phone: "+2693200000",
      },
    });
  } else {
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "SUPER_ADMIN" },
    });
  }

  // 2. Mettre à jour / créer le mot de passe dans Account (Better-Auth credential)
  await prisma.account.deleteMany({
    where: { userId: user.id, providerId: "credential" },
  });

  await prisma.account.create({
    data: {
      accountId: user.id,
      providerId: "credential",
      userId: user.id,
      password: hashedPassword,
    },
  });

  console.log("✅ Super Admin configuré avec succès !");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
