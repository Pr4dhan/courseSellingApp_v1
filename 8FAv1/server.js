import express from "express";
import {createProxyMiddleware} from "http-proxy-middleware"


const app = express()

app.use(express.static('public'));

app.use("", createProxyMiddleware({
    target: "http://localhost:3000",
    changeOrigin: true,
    credentials: true
    // pathRewrite: {
    //   "^/": "/"
    // }
  })
);

const port = 4000
app.listen(port, () => {
  console.log(`Frontend on port ${port}`)
})



// // Option 1: Relative path with ./
// app.use(express.static('./public'));
//
// // Option 2: Using import.meta.url (ES Module equivalent of __dirname)
// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';
// const __dirname = dirname(fileURLToPath(import.meta.url));
// app.use(express.static(join(__dirname, 'public')));
