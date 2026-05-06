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
        if (days === 1) return { label: 'Exp 1d', cls: 'bg-red-100 text-red-800' } ;
        if (days === 2) return { label: 'Exp 2d', cls: 'bg-orange-100 text-orange-800'} ;
        return { label: `Exp ${days}d`, cls: 'bg-green-100 text-green-800'} ;
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

        const card = document.createElement('div') ;
        card.className = 'relative flex items-center gap-3 bg-white border-2 border-gray-200 rounded-2xl p-2 w-full max-h-32 hover:border-green-600 transition-colors duration-150' ;
        card.innerHTML = `

            <div class="">
                <img
                    src="${img}"
                    alt="${name}"
                    loading="lazy"
                    class="w-18 h-18 rounded-lg object-cover shrink-0 bg-green-400"
                />
            </div>
            
            <div class="flex flex-col items-start ml-4">
                <h3 class="text-xl items-start font-semibold text-gray-900 truncate">${name}</h3>
                <p class="text-xs self-start text-gray-400">
                    Store name
                </p>
                <p class="text-xs self-start text-gray-400">
                    ${distance} away
                </p>
                <div class="flex flex-row gap-1 items-end">
                    <span class="text-base font-semibold text-gray-900">$${after.toFixed(2)}</span>
                    <span class="text-xs text-gray-400 line-through">$${before.toFixed(2)}</span>
                    <span class="text-xs font-medium text-green-700">Save $${saving}</span>
                </div>
            </div>

            <div class="flex flex-col items-end shrink-0 pr-2">
                <span class="absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full ${badge.cls}">${badge.label}</span>
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
        this.container.className = 'flex flex-col gap-3 px-2 w-full max-w-md mx-auto';
        this.items.forEach( item => {
            this.container.appendChild(new DiscountCard(item).render());
        });
    }
}