/**
 * @file server.js
 * @brief Simple HTTP server with WebSocket support.
 */

const WebSocket = require('ws');
const fs = require('fs');
const http = require('http');
const path = require('path');

const index = fs.readFileSync('public/index.html', 'utf8');

const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 8000;

