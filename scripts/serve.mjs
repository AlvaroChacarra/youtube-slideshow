import { startStaticServer } from "./runtime-harness.mjs";

const requestedPort = Number(process.env.LIENZO_PORT || process.argv[2] || 4173);
const server = await startStaticServer({ port: requestedPort });
process.stdout.write(`Lienzo V3 available at ${server.baseUrl}\n`);

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.once(signal, async () => {
    await server.close();
    process.exit(0);
  });
}
