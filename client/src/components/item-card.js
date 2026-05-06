export class DiscountCard {
    constructor(item) {
        this.item = item;
    }

    #daysUnitlExpiry() {
        const now = new Date() ;
        const expiry = new Date(this.item.expires) ;
        return Math.round((expiry - now) / (1000 * 60 * 60 * 24)) ; //convert milliseconds into days and rounds to the nearest whole number
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