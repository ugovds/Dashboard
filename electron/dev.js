import { createServer } from 'vite';
import { spawn } from 'node:child_process';
import electronPath from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

async function startDev() {
  console.log('\x1b[36m[Violet Dev]\x1b[0m Démarrage du serveur Vite en mémoire...');

  // 1. Démarrage programmé du serveur Vite
  const server = await createServer({
    configFile: path.resolve(rootDir, 'vite.config.js'),
    mode: 'development',
    server: {
      clearScreen: false,
    },
  });

  await server.listen();

  // Résolution de l'URL précise assignée par Vite
  const address = server.httpServer.address();
  const port = typeof address === 'object' && address ? address.port : 5173;
  const devUrl = `http://localhost:${port}`;

  console.log(`\x1b[32m✔ [Violet Dev]\x1b[0m Serveur Vite prêt sur \x1b[1m${devUrl}\x1b[0m`);
  console.log('\x1b[36m[Violet Dev]\x1b[0m Lancement de la fenêtre Electron...');

  // 2. Lancement du processus Electron avec l'URL résolue
  const env = {
    ...process.env,
    ELECTRON_DISABLE_SANDBOX: '1',
    VITE_DEV_SERVER_URL: devUrl,
  };

  const electronProcess = spawn(
    electronPath,
    ['.', '--no-sandbox'],
    {
      cwd: rootDir,
      stdio: 'inherit',
      env,
    }
  );

  const cleanup = () => {
    try {
      if (electronProcess && !electronProcess.killed) {
        electronProcess.kill();
      }
      server.close();
    } catch (_) {}
  };

  electronProcess.on('close', (code) => {
    console.log(`\x1b[35m[Violet Dev]\x1b[0m Processus Electron fermé (code ${code ?? 0})`);
    server.close();
    process.exit(code ?? 0);
  });

  electronProcess.on('error', (err) => {
    console.error('\x1b[31m[Violet Dev Error]\x1b[0m Erreur Electron:', err);
    cleanup();
    process.exit(1);
  });

  process.on('SIGINT', () => {
    cleanup();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    cleanup();
    process.exit(0);
  });
}

startDev().catch((err) => {
  console.error('\x1b[31m[Violet Dev Fatal]\x1b[0m Impossible d\'initialiser l\'environnement dev:', err);
  process.exit(1);
});
