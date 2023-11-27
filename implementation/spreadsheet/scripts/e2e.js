(function(){

  'use strict';

  const spawn = require('child_process').spawn;
  const kill = require('tree-kill');

  let devServerPid;
  let testScriptPid;

  function runTests() {
    return new Promise((resolve, reject) => {
      const options = { detached: false, cwd: process.cwd(), shell: true, stdio: 'pipe' };

      const child = spawn('npm', ['run', 'test'], options);
      testScriptPid = child.pid;

      child.stdout.on('data', (data) => {
        console.log(data.toString());
      });

      child.stderr.on('data', (data) => {
        console.error(data.toString());
      });

      child.on('close', (code) => {
        code === 0 ? resolve() : reject();
      });

    });
  }

  const devServer = spawn('npm', ['run', 'start'], { detached: false, cwd: process.cwd(), shell: true, stdio: 'pipe' });

  devServerPid = devServer.pid;

  devServer.stdout.on('data', (data) => {
    console.log(data.toString());
    if(data.toString().includes("No issues found.")) {
      runTests()
      .finally(() => {
        devServer.stderr.destroy();
        devServer.stdout.destroy();
        kill(devServerPid, 'SIGKILL');
      });
    }
  });

  devServer.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  devServer.on('close', (code) => {
    console.log('Test run complete.');
    // code === 0 ? resolve() : reject();
  });

}());