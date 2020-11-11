const fetch = require('node-fetch');
module.exports = {
  name: 'meow',
  description: 'random cat images, nice but not as cute as corgi',
  cooldown: 5,
  async execute(message, args) {
    let { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());
    message.channel.send(`${file}`);
  },
};