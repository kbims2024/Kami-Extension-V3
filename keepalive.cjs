const { spawn } = require('child_process');
const http = require('http');

const next = spawn('bun', ['run', 'dev'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  cwd: '/home/z/my-project',
  env: { ...process.env }
});
next.stdout.on('data', d => process.stdout.write(d));
next.stderr.on('data', d => process.stderr.write(d));
next.on('exit', (code) => {
  console.error('Next.js exited with code:', code);
  process.exit(1);
});

setInterval(() => {
  http.get('http://localhost:3000/', (res) => res.on('data', () => {})).on('error', () => {});
}, 5000);

console.log('Keepalive: Next.js PID:', next.pid);
