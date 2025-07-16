const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const start = Date.now();

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

const contacts = [
    "91xxxxx79723@c.us",
    "91xxxxx70966@c.us",
    "91xxxxx79723@c.us",
];

const message = `Hey! Hope you're doing great 😊\nSoftware testing variable:${start}`;

// Show QR in terminal
client.on('qr', qr => {
    console.log('🔐 Scan QR to authenticate:');
    qrcode.generate(qr, { small: true });
});

// Once client is ready
client.on('ready', async () => {
    console.log('✅ WhatsApp client is ready.');

    for (const id of contacts) {
        try {
            const isRegistered = await client.isRegisteredUser(id);
            if (!isRegistered) {
                console.log(`❌ Skipping ${id} — Not registered on WhatsApp.`);
                continue;
            }

            await client.sendMessage(id, message);
            console.log(`✅ Message sent to: ${id}`);
        } catch (err) {
            console.error(`❌ Failed to send to ${id}: ${err.message}`);
        }
    }

    client.destroy();

    const timeTakenMs = Date.now() - start;
    const timeTakenSec = timeTakenMs / 1000;
    console.log(`⏱️ Total time taken: ${timeTakenSec.toFixed(2)} seconds`);
});

client.initialize();
