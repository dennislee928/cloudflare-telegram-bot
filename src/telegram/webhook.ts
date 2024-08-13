import { getEnv } from '../envManagar';
import { apiUrl, response } from './lib/utils';
import { tg } from './lib/methods';

export async function setWebhook(url: URL, suffix: string) {
    const webhookUrl = `${url.protocol}//${url.hostname}${suffix}`;
    const response: response = await (await (fetch(apiUrl('setWebhook', {
        url: webhookUrl,
        secret_token: getEnv().SECRET
    })))).json();

    return new Response(JSON.stringify(response, null, 2));
}

export async function unsetWebhook() {
    const response: response = await (await (fetch(apiUrl('setWebhook', { url: '' })))).json();
    return new Response(JSON.stringify(response, null, 2));
}

export async function handleWebhook(request: Request): Promise<Response> {
    if (request.headers.get('X-Telegram-Bot-Api-Secret-Token') !== getEnv().SECRET) {
        return new Response('Unauthorized', { status: 403 });
    }
    const update: tgTypes.Update = await request.json();
    await onUpdate(update);

    return new Response(JSON.stringify(update, null, 2));
}

async function onUpdate(update: tgTypes.Update) {
    if (update.message) {
        const message = update.message;
        if (message.text === 'text') {
            const botInto = await tg.getMe();
            console.log(botInto.username);
        }
    }
}
