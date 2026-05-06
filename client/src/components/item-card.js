export class DiscountCard {
    constructor(item) {
        this.item = item;
    }

    #daysUnitlExpiry() {
        const now = new Date() ;
        const expiry = new Date(this.item.expires) ;
        return Math.round((expiry - now) / (1000 * 60 * 60 * 24)) ; //convert milliseconds into days and rounds to the nearest whole number
    }

    #expiryBadge(days) { //returns a plain object { label, cls }
        if (days <= 0) return { label: 'Expires today', cls: 'bg-red-100 text-red-800' } ;
        if (days === 1) return { label: 'Expires tomorrow', cls: 'bg-red-100 text-red-800' } ;
        if (days === 2) return { label: '2 days left', cls: 'bg-orange-100 text-orange-800'} ;
        return { label: `${days} days left`, cls: 'bg-green-100 text-green-800'} ;
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