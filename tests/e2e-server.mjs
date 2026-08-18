import { spawn } from "node:child_process";
import { createConnection } from "node:net";

/**
 * Check whether the E2E target server is already running.
 * @param {number} [port=3000]
 * @returns {Promise<boolean>}
 */
export function isServerReady(port = 3000) {
  return new Promise((resolve) => {
    const socket = createConnection(port, "localhost");
    socket.once("connect", () => {
      socket.end();
      resolve(true);
    });
    socket.once("error", () => resolve(false));
  });
}

/**
 * Wait up to `timeout` ms for the server to accept connections.
 * @param {number} [port=3000]
 * @param {number} [timeout=60000]
 */
export function waitForServer(port = 3000, timeout = 60000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tryConnect = () => {
      if (Date.now() - start > timeout) {
        reject(new Error(`Server did not become ready on port ${port} within ${timeout}ms`));
        return;
      }
      const socket = createConnection(port, "localhost");
      socket.once("connect", () => {
        socket.end();
        resolve();
      });
      socket.once("error", () => {
        setTimeout(tryConnect, 250);
      });
    };
    tryConnect();
  });
}

/**
 * Start the production server for E2E tests.
 * @returns {Promise<import('node:child_process').ChildProcess>}
 */
export async function startServer() {
  console.log("🚀 Starting production server for E2E tests...");
  const server = spawn("npm", ["run", "start"], {
    stdio: "inherit",
    shell: true,
  });

  server.on("error", (err) => {
    console.error("Failed to start server:", err);
  });

  await waitForServer(3000);
  console.log("✅ Server ready on http://localhost:3000");
  return server;
}

/**
 * Gracefully terminate the server process.
 * @param {import('node:child_process').ChildProcess} server
 */
export function stopServer(server) {
  if (!server || server.killed || server.exitCode !== null) return;
  server.kill("SIGTERM");
}
