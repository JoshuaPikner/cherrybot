
const express = require('express');
const { spawn } = require('child_process');
 
const app = express();
const port = 3000;

function runPythonScript(scriptPath, args, callback) {
    console.log(scriptPath);
    console.log(args);
    const pythonProcess = spawn('python3', [scriptPath].concat(args));
  
    let data = '';
    pythonProcess.stdout.on('data', (chunk) => {
        data += chunk.toString(); // Collect data from Python script
    });
  
    pythonProcess.stderr.on('data', (error) => {
        console.error(`stderr: ${error}`);
    });
  
    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.log(`Python script exited with code ${code}`);
            callback(`Error: Script exited with code ${code}`, null);
        } else {
            console.log('Python script executed successfully');
            callback(null, data);
        }
    });
  }

  app.get('/sudoku/:number', (req, res) => {
    const number = req.params.number;
    runPythonScript('sudoku.py', [number], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(`${result}`);
        }
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

  //12.3....435....1....4........54..2..6...7.........8.9...31..5.......9.7.....6...8
  //..............3.85..1.2.......5.7.....4...1...9.......5......73..2.1........4...9
