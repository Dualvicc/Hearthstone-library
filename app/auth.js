export default async function getBearerToken() {
    try {
        const clientId = process.env.CLIENT_ID;
        const clientSecret = process.env.CLIENT_SECRET;
        const tokenUrl = 'https://eu.battle.net/oauth/token';

        const formData = new FormData();
        formData.append('grant_type', 'client_credentials');

        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
            },
            body: formData,
        });

        const data = await response.json();

        if (response.ok) {
            return data.access_token;
        } else {
            throw new Error('Error en la solicitud');
        }
    } catch (error) {
        console.error('Error al obtener el Bearer Token:', error);
        throw error;
    }
}