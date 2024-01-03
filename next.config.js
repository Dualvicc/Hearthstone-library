/** @type {import('next').NextConfig} */
const { getBearerToken } = require('@/app/auth.js');
const fs = require('fs');

require('dotenv').config();
const nextConfig = {
    env: {
        CLIENT_ID: process.env.CLIENT_ID,
        CLIENT_SECRET: process.env.CLIENT_SECRET,
    },
}
exportPathMap: async function () {
    try {
        // Llama a la función para obtener el Bearer Token
        const token = await getBearerToken();
        console.log('Bearer Token:', token);

        // Almacena el Bearer Token en el archivo .env
        fs.appendFileSync('.env', `\nBEARER_TOKEN=${token}`);

        // Resto de la lógica de exportación de rutas si es necesario
        return {
            // ...
        };
    } catch (error) {
        console.error('Error al obtener el Bearer Token:', error);
        throw error;
    }
}
module.exports = nextConfig
