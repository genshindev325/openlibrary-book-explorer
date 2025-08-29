const { spawn, exec } = require('child_process');
const waitOn = require('wait-on');
const kill = require('tree-kill');

function runCommand(cmd) {
    return new Promise((resolve, reject) => {
        const process = exec(cmd, (err, stdout, stderr) => {
            if (err) reject(err);
            else resolve({ stdout, stderr });
        });
        process.stdout.pipe(process.stdout);
        process.stderr.pipe(process.stderr);
    });
}

async function runE2E() {
    console.log('Building application...');
    try {
        await runCommand('npm run build');
    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }

    console.log('Starting application...');
    const server = spawn('npm', ['run', 'start'], { stdio: 'inherit', shell: true });

    try {
        await waitOn({ resources: ['http://localhost:3000'], timeout: 60000 });

        console.log('Running E2E tests...');
        await runCommand('npm run e2e');
        console.log('E2E tests completed successfully');
    } catch (error) {
        console.error('E2E tests failed:', error);
        process.exit(1);
    } finally {
        console.log('Stopping server...');
        kill(server.pid, 'SIGTERM', err => {
            if (err) console.error('Failed to kill server:', err);
            else console.log('Server stopped successfully.');
        });
    }
}

runE2E().catch(error => {
    console.error('Error running E2E tests:', error);
    process.exit(1);
});
