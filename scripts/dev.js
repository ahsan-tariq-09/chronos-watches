const { spawn } = require('child_process');

const procs = [];

function run(name, command, color) {
  const proc = spawn(command, { shell: true, stdio: 'pipe' });
  procs.push(proc);

  proc.stdout.on('data', (chunk) => process.stdout.write(`${color}[${name}]\x1b[0m ${chunk}`));
  proc.stderr.on('data', (chunk) => process.stderr.write(`${color}[${name}]\x1b[0m ${chunk}`));

  proc.on('exit', (code) => {
    if (code !== 0) {
      console.error(`\n[${name}] exited with code ${code}. Stopping all processes.`);
      shutdown(code);
    }
  });
}

function shutdown(code = 0) {
  procs.forEach((proc) => {
    if (!proc.killed) proc.kill();
  });
  process.exit(code);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

run('backend', 'cd backend && . .venv/bin/activate 2>/dev/null || true; uvicorn main:app --reload --host 0.0.0.0 --port 8000', '\x1b[32m');
run('frontend', 'npm run dev -w frontend', '\x1b[36m');
