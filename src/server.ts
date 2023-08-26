import {app} from "./app";
import {env} from "./env";

app.listen({
    host: '0.0.0.0',
    port: env.PORT,
}, (err, address) => {
    if (err) throw err
    console.log(`Server is now listening on ${address}`)
})
