import {PrismaClient} from '@prisma/client'

let db = new PrismaClient()

async function go() {
  await db.joke.create({
    data: {
      name: 'BYU',
      content: `What do BYU students and UVU students have in common? They both applied to BYU.`,
    },
  })
  console.log('data is in there yo!')
}

go()
