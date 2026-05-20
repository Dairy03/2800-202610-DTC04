import axios from "axios";

const PORT = 3000;
const URL = `http://localhost:${PORT}`;

axios.defaults.withCredentials = true;

 async function getItems() {
    try{
        const result = await axios.get(`http://localhost:3000/items/`)
        console.log(result.data.items)
    } catch(error) {
        console.log(error)
    }
    }

// document.getElementById('claim-deal-btn').addEventListener(claimDeal(itemID, itemQuantity))
const items = getItems()

