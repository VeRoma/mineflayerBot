const mineflayer = require("mineflayer");
// const { mineflayer: mineflayerViewer } = require("prismarine-viewer");
// const repl = require("repl");
// const { log, replPlugin } = require("mineflayer-repl");

let botArgs = {
    host: "mc.minelandy.com", // айпи майнкрафт сервера
    // port: 25565, // прописывайте, если порт не 25565
    // username: ".OkaKira", // ник бота
    username: "KiraChallenge", // ник бота
    auth: "microsoft", // необходимо для первого входа. для пираток нужно заменить на 'offline'
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
            // this.lookAtNearestPlayer();
        });

        process.stdin.on("data", (data) => {
            const input = data.toString().trim();
            // Execute input as a chat message or command
            console.log(data);
            switch (input) {
                case "test": {
                    this.dig();
                    break;
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
                case "look": {
                    this.lookAtNearestPlayer();
                    break;
                }
                case "move": {
                    this.runAndJump();
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
            this.bot.chat("empty");
        }
    }

    lookAtNearestPlayer() {
        const playerFilter = (entity) => entity.type === "player";
        const playerEntity = this.bot.nearestEntity(playerFilter);

        if (!playerEntity) return;

        const pos = playerEntity.position.offset(0, playerEntity.height, 0);
        this.bot.lookAt(pos);
    }

    async runAndJump() {
        this.bot.setControlState("forward", true);
        this.bot.setControlState("sprint", true);
        // this.bot.setControlState('jump', true);

        await this.bot.waitForTicks(18);
        this.bot.clearControlStates();
    }

    dig(i = 1) {
        let target;

        do {
            console.log(this.bot.entity.position);
            if (this.bot.targetDigBlock) {
                console.log(`already digging ${this.bot.targetDigBlock.name}`);
            } else {
                this.arrayTarget([
                    -1, 0, -1,

                    -1, 1, -1,

                    1, 0, -1,

                    1, 1, -1,

                    0, 0, -1,

                    0, 1, -1,

                    -1, 0, -2,

                    -1, 1, -2,

                    1, 0, -2, 1, 1, -2, 0, 0, -2, 0, 1, -2,

                    -1, 0, -3, -1, 1, -3, 1, 0, -3, 1, 1, -3, 0, 0, -3, 0, 1,
                    -3,

                    -1, 0, -4, -1, 1, -4, 1, 0, -4, 1, 1, -4, 0, 0, -4, 0, 1,
                    -4,

                    -1, 0, -5, -1, 1, -5, 1, 0, -5, 1, 1, -5, 0, 0, -5, 0, 1,
                    -5,
                ]);

                if (this.pathClear([0, 0, -1])) {
                    this.runAndJump();
                }

                /*
                target = this.bot.blockAt(this.bot.entity.position.offset(0, -1, 1));
                if (this.bot.canDigBlock(target)) {
                    this.bot.setControlState('forward', true);
                    await this.bot.waitForTicks(5);
                    this.bot.clearControlStates();
                }      //   */
            }
            i--;
        } while (i > 0);
    }

    pathClear(arrayTargetArgs) {
        console.log(`pathClear running`);
        // console.log(arrayTargetArgs);
        let target;
        for (let i = 0; i < arrayTargetArgs.length; i = i + 3) {
            console.log((i + 3) / 3);
            target = this.bot.blockAt(
                this.bot.entity.position.offset(
                    arrayTargetArgs[i],
                    arrayTargetArgs[i + 1],
                    arrayTargetArgs[i + 2]
                )
            );
            //await this.digTarget(target);
            console.log(`-${target.name}-`);
            switch (target.name) {
                case ("flowing_water", "water", "flowing_lava", "lava"): {
                    this.bot.quit();
                    return 0;
                }
            }
            if (target.name != "air") return 0;
            //await this.bot.waitForTicks(5);
        }

        return 1;
    }

    async arrayTarget(arrayTargetArgs) {
        // console.log(arrayTargetArgs);
        let target;
        for (let i = 0; i < arrayTargetArgs.length; i = i + 3) {
            // console.log((i + 3) / 3);
            target = this.bot.blockAt(
                this.bot.entity.position.offset(
                    arrayTargetArgs[i],
                    arrayTargetArgs[i + 1],
                    arrayTargetArgs[i + 2]
                )
            );
            await this.digTarget(target);
            switch (target.name) {
                case ("flowing_water", "water", "flowing_lava", "lava"): {
                    this.bot.quit();
                    return;
                }
            }
            //await this.bot.waitForTicks(5);
        }
    }

    async digTarget(target) {
        if (target && this.bot.canDigBlock(target)) {
            console.log(`starting to dig ${target.name}`);
            try {
                await this.bot.dig(target);
                console.log(`finished digging ${target.name}`);
            } catch (err) {
                console.log(err.stack);
            }
        } else {
            console.log("cannot dig");
        }
    }
}

let bot = new MFBot();
