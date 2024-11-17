import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

const accountSid = process.env.SSID;
const authToken = process.env.AUTH_TOKEN;
const twilioPhoneNumber = process.env.PHNO;

const client = twilio(accountSid, authToken);

export const makeCall = async (to) => {
    try {
        const call = await client.calls.create({
            twiml: `<Response><Say>Your task deadline is approaching. Please complete it soon.</Say><Pause/><Gather input="dtmf" numDigits="1" timeout="0" /></Response>`,
            to,
            from: twilioPhoneNumber,
        });
        console.log('Call SID:', call.sid);
        return call.sid;
    } catch (error) {
        console.error('Error making call:', error);
        throw error;
    }
};
