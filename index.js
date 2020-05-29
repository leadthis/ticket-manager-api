global.PROD = ((process.env.NODE_ENV || "").toLowerCase() === 'prod') ? true : false;
global.ROOT = __dirname;

const app = require(`./config/custom-express`)();
const port = (PROD) ? 3000 : 3333;

app.listen(port, async () => {
    console.clear();
    console.log(`Rodando na porta ${port}`);
});