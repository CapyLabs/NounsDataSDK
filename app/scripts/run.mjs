import ora from 'ora'

import { spawn } from "child_process"
import { EventEmitter } from 'events';

const events = new EventEmitter()
const spinner = ora();

const graphiql = async () => {
  spinner.info("[GraphiQL] starting graphiql");
  const graphiql = spawn('node', ['./scripts/graphiql.mjs'])
  spinner.succeed("[GraphiQL] graphiql started");
  graphiql.stdout.on('data', (buffer) => {
    console.log('[GraphiqQL]',buffer.toString())
  })
}

const next = async () => {
  const next = spawn('npm', ['run', 'nextDev'])
  spinner.info("[NextJS] starting nextjs app");
  next.stdout.on('data', (buffer) => {
    console.log('[NextJS]', buffer.toString())
  })
}

const start = async () => {
  try {
    spinner.start('[Ceramic] Setting up Ceramic node\n')
    // graphiql()
    next()
  } catch (err) {
    spinner.fail(err)
  }
}

start()

process.on("SIGTERM", () => {
  // ceramic.kill();
});
process.on("beforeExit", () => {
  // ceramic.kill();
});