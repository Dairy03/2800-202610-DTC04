export class DiscountCard {
    constructor(item) {
        this.item = item;
    }

    #daysUnitlExpiry() {

    }

    #expiryBadge(days) {

    }

    //maybe discount pctage?

    render() {
        const { name, 
                img,
                distance,
                before,
                after } = this.item;
        const days = this.#daysUnitlExpiry();
        const badge = this.#expiryBadge(days);
        const saving = (before - after).toFixed(2);
    }
}