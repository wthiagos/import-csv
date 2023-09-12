import {FastifyInstance} from "fastify";
import {ReadExcelController} from "../controllers/files/read-excel.controller";

export const filesRoutes = async (app: FastifyInstance): Promise<void> => {
    const options = {
        schema: {
            consumes: ['multipart/form-data'],
            body: {
                type: 'object',
                required: ['excel'],
                properties: {
                    excel: {
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
                                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                    'text/csv',
                                    'application/vnd.ms-excel',
                                    'application/vnd.ms-excel.sheet.macroenabled.12'
                                ]
                            }
                        }
                    },
                    sheetsToIgnore: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                value: {
                                    type: 'string'
                                }
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
        '/excel',
        options,
        ReadExcelController
    );
}