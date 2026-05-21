import axios from "axios";

const params = new URLSearchParams(window.location.search);
const itemID = params.get("id");
console.log(itemID);

const PORT = 3000;
const URL = `http://localhost:${PORT}`;

axios.defaults.withCredentials = true;
// const itemID = '65f1a2b3c4d5e6f7a8b9c0d1'
const itemQuantity = 1

 async function claimDeal(itemID, itemQuantity) {
    try{
        const result = await axios.post(`http://localhost:3000/deal/accept/${itemID}/${itemQuantity}`)
        console.log(result)
    } catch(error) {
        console.log(error)
    }
    }

document.getElementById('claim-deal-btn').addEventListener("click", async () => {
    try {
        await claimDeal(itemID, itemQuantity)
        window.location.href = `./item-confirm-page.html?id=${itemID}`;
    } catch(err) {
        console.log(err)
    }
})
// claimDeal(itemID, itemQuantity)

