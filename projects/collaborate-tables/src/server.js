/**
 * @file server.js
 * Simple HTTP server with WebSocket support.
 */

const WebSocket = require('ws');
const fs = require('fs');
const http = require('http');
const path = require('path');

const index = fs.readFileSync('public/index.html', 'utf8');

const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 8000;

/**
 * Create an HTTP server to handle requests.
 *
 * This server serves static files from the 'public' directory.
 */
const server = http.createServer((req, res) => {
  const filePath = req.url === '/' ? 'index.html' : req.url; // Determine the file path based on the request URL
  const fileExt = path.extname(filePath); // Get the file extension from the file path
  const contentType = getContentType(fileExt); // Get the content type based on the file extension

  fs.readFile(path.join(__dirname, '../public', filePath), (err, content) => {
    console.log('file', err, content);
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found
        res.writeHead(404);
        res.end('404 - File Not Found');
      } else {
        // Server error
        res.writeHead(500);
        res.end('500 - Internal Server Error');
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf8');
    }
  });
});

/**
 * Get the content type based on the file extension.
 *
 * @param fileExt The file extension.
 * @return The corresponding content type.
 */
function getContentType (fileExt) {
  switch (fileExt) {
    case '.html':
      return 'text/html';
    case '.css':
      return 'text/css';
    case '.js':
      return 'text/javascript';
    default:
      return 'text/plain';
  }
}

