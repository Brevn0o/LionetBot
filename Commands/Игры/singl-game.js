const {
    Client,
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    createComponentBuilder
} = require("discord.js");
const {
    TwoZeroFourEight,
    FastType,
    FindEmoji,
    Flood,
    GuessThePokemon,
    Hangman,
    MatchPairs,
    Minesweeper,
    Slots,
    Snake,
    Trivia,
    Wordle,
    WouldYouRather
} = require('discord-gamecord');
const ms = require("ms");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("gamesingleplayer")
        .setDescription("Сыграйте в мини-игру для одного игрока в Discord.")
        .addStringOption(option =>
            option.setName("игра")
                .setDescription("Выберите игру для игры.")
                .setRequired(true)
                .addChoices(
                    { name: "2048", value: "2048" },
                    { name: "Flood", value: "flood" },
                    { name: "Вордли", value: "wordle" },
                    { name: "Матч-пары", value: "matchpairs" },
                    { name: "Мины", value: "minesweeper" },
                    { name: "Слоты", value: "slots" },
                    { name: "Змейка", value: "snake" },
                )
        )
        .setDMPermission(false),
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const game = interaction.options.getString("игра");

        switch (game) {
            case "2048": {
                const Game = new TwoZeroFourEight({
                    message: interaction,
                    slash_command: true,
                    embed: {
                        title: '2048',
                        color: 'Random'
                    },
                    emojis: {
                        up: '⬆️',
                        down: '⬇️',
                        left: '⬅️',
                        right: '➡️',
                    },
                    timeoutTime: 60000,
                    buttonStyle: 'PRIMARY',
                    playerOnlyMessage: 'Только игрок может использовать эти кнопки.'
                });

                Game.startGame();
                Game.on('gameOver', result => {
                    console.log(result);  // =>  { result... }
                });
            }
                break;
            case "flood": {
                const Game = new Flood({
                    message: interaction,
                    slash_command: true,
                    embed: {
                        title: 'Flood',
                        color: 'Random',
                    },
                    difficulty: 13,
                    timeoutTime: 60000,
                    buttonStyle: 'PRIMARY',
                    emojis: ['🟥', '🟦', '🟧', '🟪', '🟩'],
                    winMessage: 'Ты победил! Ты совершил **{turns}** шагов.',
                    loseMessage: 'Ты проиграл! Ты совершил **{turns}** шагов.',
                    playerOnlyMessage: 'Только игрок может использовать эти кнопки.'
                });

                Game.startGame();
                Game.on('gameOver', result => {
                    console.log(result);  // =>  { result... }
                });
            }
                break;
            case "matchpairs": {
                const Game = new MatchPairs({
                    message: interaction,
                    slash_command: true,
                    embed: {
                        title: 'Сопоставьте пары',
                        color: 'Random',
                        description: '**Нажимайте на кнопки, чтобы сопоставить эмодзи с их парами.**'
                    },
                    timeoutTime: 60000,
                    emojis: ['🍉', '🍇', '🍊', '🥭', '🍎', '🍏', '🥝', '🥥', '🍓', '🫐', '🍍', '🥕', '🥔'],
                    winMessage: '**Вы выиграли игру! Вы перевернули в общей сложности `{tilesTurned}` плиток.**',
                    loseMessage: '**Вы проиграли игру! Вы перевернули в общей сложности `{tilesTurned}` плиток.**',
                    playerOnlyMessage: 'Только игрок может использовать эти кнопки.'
                });

                Game.startGame();
                Game.on('gameOver', result => {
                    console.log(result);  // =>  { result... }
                });
            }
                break;
            case "minesweeper": {
                const Game = new Minesweeper({
                    message: interaction,
                    slash_command: true,
                    embed: {
                        title: 'Сапёр',
                        color: 'Random',
                        description: 'Нажимайте на кнопки, чтобы открыть блоки, кроме мин.'
                    },
                    emojis: { flag: '🚩', mine: '💣' },
                    mines: 5,
                    timeoutTime: 60000,
                    winMessage: 'Вы выиграли игру! Вы успешно миновали все мины.',
                    loseMessage: 'Вы проиграли игру! В следующий раз поберегись мин.',
                    playerOnlyMessage: 'Только игрок может использовать эти кнопки.'
                });

                Game.startGame();
                Game.on('gameOver', result => {
                    console.log(result);  // =>  { result... }
                });
            }
                break;
            case "slots": {
                const Game = new Slots({
                    message: interaction,
                    slash_command: true,
                    embed: {
                        title: 'Слот машина',
                        color: 'Random'
                    },
                    slots: ['🍇', '🍊', '🍋', '🍌']
                });

                Game.startGame();
                Game.on('gameOver', result => {
                    console.log(result);  // =>  { result... }
                });
            }
            break;
            case "wordle": {
                const Game = new Wordle({
                    message: interaction,
                    slash_command: true,
                    embed: {
                        title: 'Вордли',
                        color: 'Random',
                    },
                    customWord: null,
                    timeoutTime: 60000,
                    winMessage: 'Ты победил! Это слово было **{word}**.',
                    loseMessage: 'Ты проиграл! Это слово было **{word}**.',
                    playerOnlyMessage: 'Только игрок может использовать эти кнопки.'
                });

                Game.startGame();
                Game.on('gameOver', result => {
                    console.log(result);  // =>  { result... }
                });
            }
            break;
            case "snake": {
                const Game = new Snake({
                    message: interaction,
                    slash_command: true,
                    embed: {
                        title: 'Змейка',
                        overTitle: 'Игра окончена',
                        color: 'Random'
                    },
                    emojis: {
                        board: '⬛',
                        food: '🍎',
                        up: '⬆️',
                        down: '⬇️',
                        left: '⬅️',
                        right: '➡️',
                    },
                    stopButton: 'Стоп',
                    timeoutTime: 60000,
                    snake: { head: '🟢', body: '🟩', tail: '🟢', over: '💀' },
                    foods: ['🍎', '🍇', '🍊', '🫐', '🥕', '🥝', '🌽'],
                    playerOnlyMessage: 'Только игрок может использовать эти кнопки.'
                });

                Game.startGame();
                Game.on('gameOver', result => {
                    console.log(result);  // =>  { result... }
                })
            }
        }
    }
}