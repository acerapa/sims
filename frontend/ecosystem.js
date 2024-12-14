import { exec } from 'child_process'

exec('serve -s dist', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing command: ${error.message}`)
    return
  }

  if (stderr) {
    console.error(`stderr: ${stderr}`)
    return
  }

  // Print the command output
  console.log(`stdout: ${stdout}`)
})
