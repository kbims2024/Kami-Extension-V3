import { execSync } from 'child_process';

const PORT = 3000;

// Build and start the Next.js production server
console.log('Building Next.js...');
try {
  execSync('cd /home/z/my-project && npx next build', { stdio: 'inherit' });
  execSync('cp -r .next/static .next/standalone/.next/static', { cwd: '/home/z/my-project', stdio: 'pipe' });
  execSync('cp -r public .next/standalone/public', { cwd: '/home/z/my-project', stdio: 'pipe' });
} catch (e) {
  console.log('Build may already exist, continuing...');
}

// Start the server using spawn to keep it alive
import { spawn } from 'child_process';

const server = spawn('node', ['/home/z/my-project/.next/standalone/server.js', '-p', String(PORT)], {
  stdio: 'inherit',
  env: { ...process.env, PORT: String(PORT) },
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.on('exit', (code) => {
  console.log(`Server exited with code ${code}, restarting...`);
  setTimeout(() => {
    const newServer = spawn('node', ['/home/z/my-project/.next/standalone/server.js', '-p', String(PORT)], {
      stdio: 'inherit',
      env: { ...process.env, PORT: String(PORT) },
    });
    newServer.on('exit', () => process.exit(1));
  }, 1000);
});

console.log(`Next.js server starting on port ${PORT}...`);
