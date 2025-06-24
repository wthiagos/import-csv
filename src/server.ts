import { app } from "./app.js";
import { env } from "./env/index.js";

try {
    await app.listen({ host: '0.0.0.0', port: env.PORT });
    console.log(`🚀 Server running at http://localhost:${env.PORT}`);
} catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
}