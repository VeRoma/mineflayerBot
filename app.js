const mineflayer = require("mineflayer");
// const { mineflayer: mineflayerViewer } = require("prismarine-viewer");
// const repl = require("repl");
// const { log, replPlugin } = require("mineflayer-repl");

let botArgs = {
    host: "mc.minelandy.com", // айпи майнкрафт сервера
    port: 25565, // прописывайте, если порт не 25565
    username: "KiraChallenge", // ник бота
    auth: "microsoft", // необходимо для первого входы. для пираток нужно заменить на 'offline'
    // version: false,
};

class MFBot {
    constructor(username = botArgs.username) {
        this.username = username;
        this.host = botArgs.host;
        if (botArgs.port) this.port = botArgs.port;
        if (botArgs.version) this.version = botArgs.version;

        this.initBot();
    }

    initBot() {
        this.bot = mineflayer.createBot({
            username: this.username,
            host: this.host,
            port: this.port,
            //"version": this.version
        });

        this.initEvents();
    }

    initEvents() {
        this.bot.on("login", () => {
            let botSocket = this.bot._client.socket;
            console.log(
                `[${this.username}] Logged in to ${
                    botSocket.server ? botSocket.server : botSocket._host
                }`
            );
        });

        this.bot.on("end", () => {
            console.log(`Disconnected`);
        });

        this.bot.on("error", (err) => {
            if (err.code === "ECONNREFUSED") {
                console.log(`Failed to connect to ${err.address}:${err.port}`);
            } else {
                console.log(`Unhandled error: ${err}`);
            }
        });

        this.bot.on("spawn", async () => {
            console.log(`Spawned in`);

            await this.bot.waitForTicks(10000);
            console.log(`Goodbye`);
            this.bot.quit();
        });

        this.bot.on("physicTick", () => {
            this.lookAtNearestPlayer();
        });

        process.stdin.on("data", (data) => {
            const input = data.toString().trim();

            // Execute input as a chat message or command
            //console.log(data);

            switch (input) {
                case "move": {
                }
                case "list": {
                    this.sayItems();
                    break;
                }
                case "qq": {
                    this.bot.quit();
                    break;
                }
                case "sayHi": {
                    this.bot.chat("Привет!");
                    break;
                }
            }
        });
    }

    sayItems(items = this.bot.inventory.items()) {
        const output = items.join(", ");
        if (output) {
            //   bot.chat(output)
            console.log(items);
        } else {
            bot.chat("empty");
        }
    }

    lookAtNearestPlayer() {
        const playerFilter = (entity) => entity.type === "player";
        const playerEntity = this.bot.nearestEntity(playerFilter);

        if (!playerEntity) return;

        const pos = playerEntity.position.offset(0, playerEntity.height, 0);
        this.bot.lookAt(pos);
    }
}

let bot = new MFBot();
