module.exports = {
    name: '8ball',
    description: 'The magic 8ball knows all ask it anything and it will reveal its secrets',
    cooldown: 5,
    execute(message, args) {
        const responses = [
            "it is certain",
            "it is decidedly so",
            "without a doubt",
            "yes – definitely",
            "you may rely on it",
            "as I see it",
            "yes",
            "most Likely",
            "outlook good",
            "yes",
            "signs point to yes"
        ];

        var randomIndex = Math.floor(Math.random() * responses.length);
        message.channel.send(`🎱  says '${responses[randomIndex]}'`);

    }
};