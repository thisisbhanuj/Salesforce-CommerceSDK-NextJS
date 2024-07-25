'use server'

import { ClientConfig } from "@/types/SCAPIType";

export async function generateAuthHeader(clientConfig: ClientConfig, isGuest: boolean): Promise<string> {
    const guestTokenObject: any = isGuest ? 
        Buffer.from(`${clientConfig.parameters.clientId}:${clientConfig.parameters.secret}`).toString('base64') : 
        Buffer.from(`${clientConfig.shopper?.username}:${clientConfig.shopper?.password}`).toString('base64');
    return `Basic ${guestTokenObject.access_token}`;
}