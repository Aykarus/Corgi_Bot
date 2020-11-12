module.exports = {
    name: 'roll-die',
    description: 'Roll random number between 1-6',
    cooldown: 5,
    execute(message, args) {
        var roll = Math.floor(Math.random() * 6) + 1;
        message.channel.send(`${message.author} rolled a ${roll}`);
    },
};