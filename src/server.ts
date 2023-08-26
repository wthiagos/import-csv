import {app} from "./app";
import Fastify from "fastify";
import multipart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';
import {pipeline} from 'node:stream';
import util from 'node:util';
import fs from 'node:fs';
import {readFileStream} from "./utils/read-file-stream";

const pump = util.promisify(pipeline);

app.register(rateLimit, {
    max: 3
})

// @ts-ignore
app.register(multipart, {
    limits: {
        fieldNameSize: 100, // Max field name size in bytes
        fieldSize: 100,     // Max field value size in bytes
        fields: 10,         // Max number of non-file fields
        fileSize: 1000000,  // For multipart forms, the max file size in bytes
        files: 1,           // Max number of file fields
        headerPairs: 2000,  // Max number of header key=>value pairs
        parts: 1000         // For multipart forms, the max number of parts (fields + files)
    }
});

app.post('/excel', async function handler(req, reply) {
    const data = await req.file();
    
    if(!data)
        return reply.status(501).send({error: `teste`})
    
    const buffer = await data.toBuffer()

    const records  = readFileStream(buffer);
    
    return reply
        .status(200)
        .send(records)
});

app.setErrorHandler(function (error, request, reply) {
    if (error instanceof Fastify.errorCodes.FST_ERR_BAD_STATUS_CODE) {
        // Log error
        this.log.error(error)
        // Send error response
        reply.status(500).send({ok: false})
    } else if (error.statusCode === 429) {
        reply.code(429)
        error.message = 'You hit the rate limit! Slow down please!'
    }

    reply.send(error)
})

app.listen({port: 3000}, (err, address) => {
    if (err) throw err
    // Server is now listening on ${address}
})

// const server = http.createServer(async (req, res) => {
//     const {
//         method,
//         url
//     } = req;
//
//     await json(req, res);
//
//     if (method === 'POST' && url === '/excel') {
//
//     } else if (method === 'POST' && url === '/excel-stream') {
//         let endBuffers: any = {};
//
//         const form = formidable({
//             fileWriteStreamHandler: (file: any) => {
//                 const chunks: any[] = [];
//
//                 return new Writable({
//                     write(chunk, enc, next) {
//                         chunks.push(chunk);
//                         next();
//                     },
//                     destroy() {
//                         endBuffers = {};
//                     },
//                     final(cb) {
//                         // if filename option is not provided file.newFilename will be a random string
//                         endBuffers[file.newFilename] = Buffer.concat(chunks);
//                         cb();
//                     },
//                 });
//             },
//         });
//
//         form.parse(req, (err, fields, files) => {
//             if (err) {
//                 console.error(err);
//                 res.writeHead(err.httpCode || 400, {'Content-Type': 'text/plain'});
//                 res.end(String(err));
//                 return;
//             }
//
//             let records: any = {};
//
//             Object.entries(endBuffers).map(([key, value]) => {
//                 const workbook = xlsx.read(value);
//
//                 workbook.SheetNames.forEach(s => {
//                     if (s === 'Manual de Preenchimento' || s === 'Documentações Exigidas' || s === 'AUXILIAR')
//                         return;
//
//                     records[s] = {
//                         name: s,
//                         records: xlsx.utils.sheet_to_json(workbook.Sheets[s])
//                     };
//                 });
//             });
//
//             res
//                 .writeHead(200)
//                 .end(JSON.stringify(records, null, 2));
//         });
//     } else {
//         res
//             .writeHead(404)
//             .end();
//     }
//
//     return;
// });
//
// server.listen(3333);
//
// export default server;