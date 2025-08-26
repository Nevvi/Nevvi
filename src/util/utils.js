class Mutex {
    constructor() {
        this.locked = false;
        this.waiting = [];
    }

    async acquire() {
        while (this.locked) {
            await new Promise(resolve => this.waiting.push(resolve));
        }
        this.locked = true;
    }

    release() {
        this.locked = false;
        if (this.waiting.length > 0) {
            const resolve = this.waiting.shift();
            resolve();
        }
    }
}