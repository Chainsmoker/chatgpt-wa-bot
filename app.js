const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const { Configuration, OpenAIApi } = require("openai");

const client = new Client({
  authStrategy: new LocalAuth(),
});

const configuration = new Configuration({
    organization: "org-m3r3ybM8qalFju6V7vZ0J8WT",
    apiKey: "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",
});

client.initialize();

const openai = new OpenAIApi(configuration);

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('message', async message => {
  if (message.body.startsWith("/q")) {   
    const response = await openai.createCompletion({
        model: "text-davinci-001",
        prompt: message.body.replace("/q", ""),
        max_tokens: 2000,
        temperature: 0,
    });
    
    console.log(message.body.replace("/q", ""))
    message.reply(response.data["choices"][0].text)

  }

  else if (message.body.startsWith("/create")) {
    const responseImage = await openai.createImage({
      prompt: message.body.replace("/create", ""),
      n: 2,
      size: "1024x1024",
    });
    const media = await MessageMedia.fromUrl(responseImage["data"].data[0].url);
    message.reply(media)
  }

  else if (message.body.startsWith("/code")){
    const responseCode = await openai.createCompletion({
      model: "code-davinci-002",
      prompt: message.body.replace("/code", ""),
      max_tokens: 2000,
      temperature: 0,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: ["\"\"\""],
    });
    message.reply(responseCode.data["choices"][0].text)
  }

  else if (message.body.startsWith("/cmds")){
    cmds = `
/q - Responde una pregunta

/create - Crea una imagen

/code - Autocompleta codigo

Owner wa.me/51963357835
    `
    message.reply(cmds)
  }
});