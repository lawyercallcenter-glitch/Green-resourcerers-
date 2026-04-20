/**
 * Vapi.ai configuration for the Green Resourcerers mobile app.
 *
 * How to find your keys
 * ---------------------
 * 1. Go to https://dashboard.vapi.ai
 * 2. Open Account → Keys
 * 3. Copy your **Public Key** and paste it below as VAPI_PUBLIC_KEY.
 *    (The Public Key is safe to ship in client-side code.)
 * 4. Copy your **Assistant ID** from the Assistants page and paste it
 *    below as VAPI_ASSISTANT_ID.
 *
 * Never put your Private / Server API key in the mobile app.
 */

/** Vapi.ai Public Key — used to initialise the SDK on the client. */
export const VAPI_PUBLIC_KEY = 'YOUR_VAPI_PUBLIC_KEY';

/**
 * The assistant to launch when the user taps "Call Us".
 * Create one at https://dashboard.vapi.ai/assistants
 * or leave blank to use the server-side assistant-request webhook.
 */
export const VAPI_ASSISTANT_ID = 'YOUR_VAPI_ASSISTANT_ID';
