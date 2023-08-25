import http from 'node:http';
import {json} from './middlewares/json.js';
import formidable, {errors as formidableErrors} from 'formidable';
import {validateFields} from './utils/validate-fields.js';
import xlsx from "xlsx";
import {Writable} from 'node:stream';

const server = http.createServer(async (req, res) => {
    const {
        method,
        url
    } = req;

    await json(req, res);

    if (method === 'POST' && url === '/excel') {
        try {
            let fields;
            let files;

            const form = formidable({});
            [fields, files] = await form.parse(req);

            const fieldsToValidate = [
                {
                    name: 'excel',
                    value: files.excel
                }
            ];

            const formErrors = validateFields(fieldsToValidate);

            if (formErrors) {
                res.writeHead(501);
                res.end(JSON.stringify({errors: formErrors}, null, 2));
                return;
            }

            const path = files.excel[0].filepath;

            let records: any = {};

            const workbook = xlsx.readFile(path);

            workbook.SheetNames.forEach(s => {
                if (s === 'Manual de Preenchimento' || s === 'Documentações Exigidas' || s === 'AUXILIAR')
                    return;

                records[s] = {
                    name: s,
                    records: xlsx.utils.sheet_to_json(workbook.Sheets[s])
                };
            });

            res
                .writeHead(200)
                .end(JSON.stringify(records, null, 2));
        } catch (err: any) {
            // example to check for a very specific error
            if (err.code === formidableErrors.maxFieldsExceeded) {

            }
            console.error(err);
            res.writeHead(err.httpCode || 400, {'Content-Type': 'text/plain'});
            res.end(String(err));
            return;
        }
    } else if (method === 'POST' && url === '/excel-stream') {
        let endBuffers: any = {};

        const form = formidable({
            fileWriteStreamHandler: (file: any) => {
                const chunks: any[] = [];

                return new Writable({
                    write(chunk, enc, next) {
                        chunks.push(chunk);
                        next();
                    },
                    destroy() {
                        endBuffers = {};
                    },
                    final(cb) {
                        // if filename option is not provided file.newFilename will be a random string
                        endBuffers[file.newFilename] = Buffer.concat(chunks);
                        cb();
                    },
                });
            },
        });

        form.parse(req, (err, fields, files) => {
            if (err) {
                console.error(err);
                res.writeHead(err.httpCode || 400, {'Content-Type': 'text/plain'});
                res.end(String(err));
                return;
            }

            let records: any = {};

            Object.entries(endBuffers).map(([key, value]) => {
                const workbook = xlsx.read(value);

                workbook.SheetNames.forEach(s => {
                    if (s === 'Manual de Preenchimento' || s === 'Documentações Exigidas' || s === 'AUXILIAR')
                        return;

                    records[s] = {
                        name: s,
                        records: xlsx.utils.sheet_to_json(workbook.Sheets[s])
                    };
                });
            });

            res
                .writeHead(200)
                .end(JSON.stringify(records, null, 2));
        });
    } else {
        res
            .writeHead(404)
            .end();
    }

    return;
});

server.listen(3333);

export default server;