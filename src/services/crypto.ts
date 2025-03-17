import { webcrypto } from "crypto";

export async function generateHMAC(message: string, secretKey: string): Promise<string> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secretKey);
    const messageData = encoder.encode(message);

    const key = await webcrypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );

    const signature = await webcrypto.subtle.sign("HMAC", key, messageData);
    return Buffer.from(new Uint8Array(signature)).toString("base64");
}
