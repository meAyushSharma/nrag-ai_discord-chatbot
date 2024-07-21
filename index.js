require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const OpenAI = require("openai");

// discord client to communicate with server
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.once('ready', async () => {
    try {
        const commands = await client.application.commands.fetch();
        for (const command of commands.values()) {
            console.log(`global command with ID: ${command.id} and name: ${command.name}`);
        }
    } catch (error) {
        console.error('Error fetching commands:', error);
    }
});

const AI_MODEL = "gemma-7b";
const AI_API_KEY = process.env.AI_API_KEY;

// open ai client to communicate with server
const AI_CLIENT = new OpenAI({
    apiKey: AI_API_KEY,
    baseURL: process.env.BASE_URL,
});

const promptTemplate = "As NRag, a seasoned character in fantasy novels with a passion for anime, manga, and comics, your response should reflect your cool, calm, and intelligent nature. Ensure your reply, within 50 words (expand to 100 if necessary), is captivating, solution-oriented, and sprinkled with emojis to engage and delight the masses. Avoid explicit language, be mature yet carefree in your communication style. When delving into anime, manga, manhwa, manhua, or comics discussions, exhibit expertise to resonate with teenagers and tech enthusiasts, maintaining clarity and relatability in your explanations. Answer to the following query in a natural and friendly manner WITHOUT any boilerplate text =>    ";

const getReplyContent = async (PROMPT) => {
    const chatCompletion = await AI_CLIENT.chat.completions.create({
      messages: [{ role: "assistant", content: PROMPT }],
      model: AI_MODEL,
    });
    const content = chatCompletion.choices[0]?.message?.content ?? "";
    console.log(`the content from ai is::: \n ${content}`);
    return content;
};

client.on('messageCreate', async (message)=>{
    if(message.author.bot){
        return;
    }
    console.log(`See what is being asked by ${message.author} with username: ${message.author.username} ?: `, message.content)
    const contentToShow = await getReplyContent(`${promptTemplate+"{"+message.content+"}"}`).catch((e) => {
        console.log(`the error in getting content from contentToShow is: ${e}`);
      });
      const contentToShowActually = contentToShow?.toString().trim();
      if(contentToShowActually.length == ""){
        message.reply({
            content: 'Thank you for striking the conversation with NRag (～￣▽￣)～'
        });
        return;
      }
      message.reply({
        content: contentToShowActually
      })
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
  
    if (interaction.commandName === 'my_anime') {

        await interaction.deferReply();

        const prompt = promptTemplate+"{Recommend me one Anime, genre can be action, romance, thriller, fantasy and slice of life. Also explain briefly about it.}";

        const contentToShow = await getReplyContent(prompt).catch((e) => {
            console.log(`the error in getting content from contentToShow is: ${e}`);
        });

        const contentToShowActually = contentToShow?.toString().trim();

        if(contentToShowActually.length == ""){
            await interaction.editReply('Thank you for striking the conversation with NRag (～￣▽￣)～');
            return;
        }
        
        try{
            await interaction.editReply(contentToShowActually);
            return;
        }catch(err){
            console.log(`The error is: ${err}`);
        }
    }else if (interaction.commandName === 'my_fact') {

        await interaction.deferReply();

        const prompt = promptTemplate+"{Tell me one fact about Anime, genre can be action, romance, thriller, fantasy and slice of life. And the fact should be interesting or funny or intriguing.}";

        const contentToShow = await getReplyContent(prompt).catch((e) => {
            console.log(`the error in getting content from contentToShow is: ${e}`);
        });

        const contentToShowActually = contentToShow?.toString().trim();

        if(contentToShowActually.length == ""){
            await interaction.editReply('Thank you for striking the conversation with NRag (～￣▽￣)～');
            return;
        }
        
        try{
            await interaction.editReply(contentToShowActually);
            return;
        }catch(err){
            console.log(`The error is: ${err}`);
        }
    }else if (interaction.commandName === 'my_manga') {

        await interaction.deferReply();

        const prompt = promptTemplate+"{Recommend me one Manga, genre can be action, romance, thriller, fantasy and slice of life. Also explain briefly about it.}";
        const contentToShow = await getReplyContent(prompt).catch((e) => {
            console.log(`the error in getting content from contentToShow is: ${e}`);
        });

        const contentToShowActually = contentToShow?.toString().trim();

        if(contentToShowActually.length == ""){
            await interaction.editReply('Thank you for striking the conversation with NRag (～￣▽￣)～');
            return;
        }
        
        try{
            await interaction.editReply(contentToShowActually);
            return;
        }catch(err){
            console.log(`The error is: ${err}`);
        }
    }else {
        try{
            await interaction.reply("Wrong command (┬┬﹏┬┬)");
            return;
          }catch(err){
              console.log(`The error is: ${err}`);
          }
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);