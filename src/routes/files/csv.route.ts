import {FastifyInstance} from "fastify";
import {ReadCsvController} from "../../controllers/files/read-csv-controller";

export const csvRoutes = async (app: FastifyInstance): Promise<void> => {
    const options = {
        schema: {
            consumes: ['multipart/form-data'],
            body: {
                type: 'object',
                required: ['csv'],
                properties: {
                    csv: {
                        type: 'object',
                        properties: {
                            encoding: {
                                type: 'string'
                            },
                            filename: {
                                type: 'string'
                            },
                            limit: {
                                type: 'boolean'
                            },
                            mimetype: {
                                type: 'string',
                                enum: [
                                    'text/csv'
                                ]
                            }
                        }
                    },
                    delimiter: {
                        type: 'object',
                        properties: {
                            value: {
                                type: 'string',
                                default: ';'
                            }
                        }
                    },
                    headerLine: {
                        type: 'object',
                        properties: {
                            value: {
                                type: 'number',
                                default: 0
                            }
                        }
                    },
                    ignoreLastLine: {
                        type: 'object',
                        properties: {
                            value: {
                                type: 'boolean',
                                default: false
                            }
                        }
                    },
                }
            }
        }
    };

    app.post(
        '/csv',
        options,
        ReadCsvController
    );
}