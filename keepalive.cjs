const { spawn } = require('child_process');
const http = require('http');

const next = spawn('npx', ['next', 'dev', '-p', '3000'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  shell: true,
  cwd: '/home/z/my-project',
  env: { ...process.env }
});
next.stdout.on('data', d => process.stdout.write(d));
next.stderr.on('data', d => process.stderr.write(d));
next.on('exit', () => process.exit(1));

setInterval(() => {
  http.get('http://localhost:3000/', (res) => res.on('data', () => {})).on('error', () => {});
}, 5000);

console.log('Keepalive: Next.js PID:', next.pid);
