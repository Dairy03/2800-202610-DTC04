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

        const card = document.createElement('listing') ;
        card.className = 'flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3 hover:border-gray-300 transition-colors duration-150' ;
        card.innerHTML = `
            <img
                src="${img}"
                alt="${name}"
                loading="lazy"
                class="w-18 h-18 rounded-lg object-cover shrink-0 bg-gray-100"
            />

            <div class="flex-1 min-w-0">
                <h3 class="text-sm font-medium text-gray-900 truncate mb-0.5">${name}</h3>

                <p class="flex items-center gap-1 text-xs text-gray-400 mb-2">
                    ${distance}
                </p>

                <div class="flex items-baseline gap-2">
                    <span class="text-base font-semibold text-gray-900">$${after.toFixed(2)}</span>
                    <span class="text-xs text-gray-400 line-through">$${before.toFixed(2)}</span>
                    <span class="text-xs font-medium text-green-700">Save $${saving}</span>
                </div>
            </div>

            <div class="flex flex-col items-end gap-2 shrink-0">
                <span class="text-xs font-medium px-2.5 py-1 rounded-full ${badge.cls}">${badge.label}</span>
                <span class="text-xs font-medium bg-gray-100 text-gray-700 rounded-lg px-2 py-1">-${pct}%</span>
            </div>
        ` ;
        return card;
    }
}

export class DiscountList {
    constructor(selector, items =[]) {
        this.container = typeof selector === 'string'
        ? document.querySelector(selector)
        : selector ;
    this.items = items ;
    }

    render() {
        this.container.innerHTML = '' ;
        this.container.className = 'flex flex-col gap-3';
        this.items.forEach( item => {
            this.container.appendChild(new DiscountCard(item).render());
        });
    }
}