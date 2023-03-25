import http from 'http';
import { json } from './middlewares/json.js';
import { CSVController } from "./controllers/csv-controller.js"
import { parse } from "csv-parse";
import formidable from 'formidable';
import fs from 'node:fs/promises';
import { validateFields } from './utils/validate-fields.js';

const server = http.createServer(async (req, res) => {
    const { method, url } = req;

    await json(req, res);

    if (method === 'POST' && url === '/csv') {
        const form = formidable();

        form.parse(req, (err, fields, files) => {
            if (err) {
                res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
                res.end(String(err));
                return;
            }

            const fieldsToValidate = [
                {
                    name: 'csv',
                    value: files.csv
                },
                {
                    name: 'delimiter',
                    value: fields.delimiter
                }
            ];


            const formErrors = validateFields(fieldsToValidate);

            if (formErrors) {
                res.writeHead(501);
                res.end(JSON.stringify({ errors: formErrors }, null, 2));
                return;
            }

            const records = [];

            const options = {
                delimiter: fields.delimiter,
                trim: true,
                columns: true
            };

            const parser = parse(options);

            fs
                .open(files.csv.filepath)
                .then((data) => {
                    data
                        .createReadStream(files.csv.filepath)
                        .pipe(parser)
                        .on('data', function (csvrow) {
                            records.push(csvrow);
                        })
                        .on('end', function () {
                            res
                                .writeHead(200)
                                .end(JSON.stringify(records, null, 2));
                        });
                })
        });
    }
    else {
        return res
            .writeHead(404)
            .end();
    }

    return;
});

server.listen(3333);