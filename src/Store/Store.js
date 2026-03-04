export class Store {
    #score = 0;

    getScore () {
        return this.#score;
    }

    dispatch(type) {
        switch(type) {
            case 'ITEM_DESTROYED':
                this.#score++;
                break;
            default:
                console.log(`Unknown action: ${type}`);
        }
    }
}