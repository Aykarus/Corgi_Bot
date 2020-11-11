const fetch = require('node-fetch');
module.exports = {
    name: 'woof',
    description: 'random corgi images, awww so cute!',
    cooldown: 5,
    async execute(messages, args) {
        const { message } = await fetch('https://dog.ceo/api/breed/corgi/cardigan/images/random').then(response => response.json());
        messages.channel.send(message);
    }
};