import Webhook from "../model/Webhook";

export const squadWebhook = async (payload: any, signature?: any) => {
    try {
        const newWebhook = await Webhook.create({
            user: payload.customer_identifier,
            payload,
            signature,
        });
        return newWebhook;
    } catch (err: any) {
        throw err;
    }
};
