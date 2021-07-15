import { SiteClient } from 'datocms-client';

export default async function recebedorDeRequests(request, response) {
    if (request.method === 'POST') {
        const TOKEN = '9735c227eca6933b804d54769d4721';
        const client = new SiteClient(TOKEN);

        const registroCriado = await client.items.create({
            itemType: "967581", // ID referente ao MODELS do COMMUNITY do DATOCMS
            ...request.body,
            /*title: "comunidade de teste",
            imageUrl: "https://github.com/jwfelipee.png",
            creatorSlug: "Joao Wictor"*/
        })
        console.log(registroCriado);

        response.json({
            dados: 'Algum dado qualquer',
            registroCriado: registroCriado,
        });
        return;
    }
    response.status(404).json({
        message: 'Ainda nao temos nada no GET, mas no POST tem!'
    })
}