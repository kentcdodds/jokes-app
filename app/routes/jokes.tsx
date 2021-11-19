import {ActionFunction, Form, LoaderFunction, redirect, useCatch} from 'remix'
import {useLoaderData} from 'remix'
import {PrismaClient} from '@prisma/client'

let db: PrismaClient

export let action: ActionFunction = async ({request}) => {
  let body = Object.fromEntries((await request.formData()).entries())
  let {name, content} = body
  if (typeof name !== 'string' || typeof content !== 'string') {
    return {error: 'invalid form submission'}
  }
  if (!db) {
    db = new PrismaClient()
  }
  await db.joke.create({data: {name, content}})
  return redirect('/jokes')
}

export let loader: LoaderFunction = async () => {
  if (!db) {
    db = new PrismaClient()
  }
  let jokes = await db.joke.findMany()
  if (!jokes.length) {
    throw new Response('no joke found. Oh no', {
      status: 404,
    })
  }

  return {jokes}
}

export default function JokesRoute() {
  let data = useLoaderData()
  return (
    <div>
      Jokes!
      <Form method="post">
        <label>
          Name: <input name="name" />
        </label>
        <label>
          Content: <textarea name="content" />
        </label>
        <button type="submit">Submit</button>
      </Form>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

export function CatchBoundary() {
  const caught = useCatch()
  if (caught.status === 404) {
    return <div>Could not find your stuff</div>
  }
  throw new Error('wut?')
}

export function ErrorBoundary({error}: {error: Error}) {
  console.error(error)

  return <div>I did a whoopsies</div>
}
