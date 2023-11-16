const mineflayer = require("mineflayer");
const { Entity } = require("prismarine-entity");
const { pathfinder, Movements, goals } = require("mineflayer-pathfinder");
const GoalFollow = goals.GoalFollow;
const mineflayerViewer = require("prismarine-viewer").mineflayer;

const bot = mineflayer.createBot({
    host: "localhost",
    port: 62488,
    username: "MyBot",
});



bot.loadPlugin(pathfinder);

function followPlayer() {
    const playerKiraChallenge = bot.players["KiraChallenge"];

    if (!playerKiraChallenge) {
        bot.chat("I can't see KiraChallenge");
        return;
    }

    const mcData = require("minecraft-data")(bot.version);
    const movements = new Movements(bot, mcData);
    bot.pathfinder.setMovements(movements);

    const goal = new GoalFollow(playerKiraChallenge.entity, 5);
    bot.pathfinder.setGoal(goal, true);

    mineflayerViewer(bot, { port: 3000 }); // Start the viewing server on port 3000

    // Draw the path followed by the bot
    const path = [bot.entity.position.clone()];
    bot.on("move", () => {
        if (path[path.length - 1].distanceTo(bot.entity.position) > 1) {
            path.push(bot.entity.position.clone());
            bot.viewer.drawLine("path", path);
        }
    });
}

bot;

bot.once("spawn", followPlayer);
// bot.once("spawn", function () {
// bot.chat("Hello world!");
// });
function lookAtNearestPlayer() {
    const playerFilter = (entity) => entity.type === "player";
    const playerEntity = bot.nearestEntity(playerFilter);
    if (!playerEntity) return;

    const pos = playerEntity.position.offset(0, playerEntity.height, 0);
    bot.lookAt(pos);
}

bot.on("physicTick", lookAtNearestPlayer);
