const { spawn } = require('child_process');

const procs = [];

function run(name, args, color) {
  const proc = spawn('npm', args, { shell: true, stdio: 'pipe' });
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

run('backend', ['run', 'dev:backend'], '\x1b[32m');
run('frontend', ['run', 'dev:frontend'], '\x1b[36m');
