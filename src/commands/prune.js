module.exports = {
    name: 'prune',
    description: 'This deletes past messages, up to 99 messages',
    execute(message, args) {
        //prevent original message from being deleted
        const amount = parseInt(args[0]) + 1;

        if (isNaN(amount)) {
            return message.reply('that doesn\'t seem to be a valid number.');
        } else if (amount < 1 || amount > 99) {
            return message.reply('you need to input a number between 1 and 99.');
        }

        // ...
        message.channel.bulkDelete(amount, true).catch(err => {
            console.error(err);
            message.channel.send('there was an error trying to prune messages in this channel!');
        });
    },
};