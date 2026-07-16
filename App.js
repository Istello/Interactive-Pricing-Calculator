/* CLIENT CONFIGURATION */
const CLIENT_CONFIG = {
    businessName: "SparkleClean Co.",
    phone: "1234567890"
};

/* PRICING RULES */
const PRICING_RULES = {
    basePrice: 50,
    pricePerRoom: 25,
    pricePerBathroom: 15,
    serviceTypes: {
        standard: {
            label: "Standard Clean",
            multiplier: 1.0
        },
        deep: {
            label: "Deep Clean",
            multiplier: 1.5
        },
        moving: {
            label: "Move In/Out",
            multiplier: 1.8
        }
    },
    addons: [
        {
            id: "windows",
            label: "Inside Windows",
            price: 30,
            icon: "🪟"
        },
        {
            id: "fridge",
            label: "Fridge Interior",
            price: 25,
            icon: "🧊"
        },
        {
            id: "oven",
            label: "Oven Deep Clean",
            price: 35,
            icon: "🍳"
        },
        {
            id: "pets",
            label: "Pet Hair Detail",
            price: 20,
            icon: "🐾"
        }
    ],
    discounts: {
        once: {
            label: "One-Time",
            value: 0
        },
        weekly: {
            label: "Weekly",
            value: 0.20
        },
        biweekly: {
            label: "Bi-Weekly",
            value: 0.15
        },
        monthly: {
            label: "Monthly",
            value: 0.10
        }
    }
};

/*  APPLICATION STATE */
const state = {
    rooms: 2,
    bathrooms: 1,
    serviceType: "standard",
    selectedAddons: [],
    frequency: "once"
};
let finalPriceCalculated = 0;

/*  DOM ELEMENTS */
const businessTitle = document.getElementById("business-title");
const roomsDisplay = document.getElementById("rooms-display");
const bathsDisplay = document.getElementById("baths-display");
const totalPrice = document.getElementById("total-price");
const intensityContainer = document.getElementById("intensity-container");
const addonsContainer = document.getElementById("addons-container");
const frequencyContainer = document.getElementById("frequency-container");

/*  INITIALIZATION */
document.addEventListener("DOMContentLoaded", initApp);
function initApp(){
    businessTitle.textContent =
        `Calculate Your ${CLIENT_CONFIG.businessName} Quote`;
    renderServiceTypes();
    renderAddons();
    renderFrequencies();
    calculatePrice();
}
/* RENDER FUNCTIONS */
function renderServiceTypes() {
    intensityContainer.innerHTML = "";
    Object.entries(PRICING_RULES.serviceTypes).forEach(([key, service]) => {
        const button = document.createElement("button");
        button.id = `service-${key}`;
        button.innerHTML = `
            <strong>${service.label}</strong>
            <small>
                ${
                    service.multiplier === 1
                    ? "Standard"
                    : `+${Math.round((service.multiplier-1)*100)}%`
                }
            </small>
        `;
        button.onclick = () => setServiceType(key);
        intensityContainer.appendChild(button);
    });
    updateActiveButtons();
}

function renderAddons() {
    addonsContainer.innerHTML = "";
    PRICING_RULES.addons.forEach(addon => {
        const button = document.createElement("button");
        button.id = `addon-${addon.id}`;
        button.innerHTML = `
            <div class="icon">${addon.icon}</div>
            <strong>${addon.label}</strong>
            <small>+$${addon.price}</small>
        `;
        button.onclick = () => toggleAddon(addon.id);
        addonsContainer.appendChild(button);
    });
    updateActiveButtons();
}

function renderFrequencies() {
    frequencyContainer.innerHTML = "";
    Object.entries(PRICING_RULES.discounts).forEach(([key,item]) => {
        const button = document.createElement("button");
        button.id = `frequency-${key}`;
        button.innerHTML = `
            <strong>${item.label}</strong>
            ${
                item.value > 0
                ? `<small>${item.value*100}% OFF</small>`
                : `<small>No Discount</small>`
            }
        `;
        button.onclick = () => setFrequency(key);
        frequencyContainer.appendChild(button);
    });
    updateActiveButtons();
}

/* COUNTERS */
function updateRooms(change){
    state.rooms = Math.max(1, state.rooms + change);
    roomsDisplay.textContent = state.rooms;
    calculatePrice();
}

function updateBaths(change){
    state.bathrooms = Math.max(1, state.bathrooms + change);
    bathsDisplay.textContent = state.bathrooms;
    calculatePrice();
}

/* STATE CHANGES */
function setServiceType(type){
    state.serviceType = type;
    updateActiveButtons();
    calculatePrice();
}

function toggleAddon(id){
    if(state.selectedAddons.includes(id)){
        state.selectedAddons =
            state.selectedAddons.filter(item => item !== id);
    }else{
        state.selectedAddons.push(id);
    }
    updateActiveButtons();
    calculatePrice();
}

function setFrequency(freq){
    state.frequency = freq;
    updateActiveButtons();
    calculatePrice();
}

/* ACTIVE BUTTONS */
function updateActiveButtons(){
    document
        .querySelectorAll("#intensity-container button")
        .forEach(btn => btn.classList.remove("active"));
    document
        .querySelectorAll("#addons-container button")
        .forEach(btn => btn.classList.remove("active"));
    document
        .querySelectorAll("#frequency-container button")
        .forEach(btn => btn.classList.remove("active"));
    document
        .getElementById(`service-${state.serviceType}`)
        ?.classList.add("active");
    state.selectedAddons.forEach(id=>{
        document
            .getElementById(`addon-${id}`)
            ?.classList.add("active");
    });
    document
        .getElementById(`frequency-${state.frequency}`)
        ?.classList.add("active");
}

/* PRICE CALCULATION */
function calculatePrice() {
    // Base price
    let subtotal =
        PRICING_RULES.basePrice +
        (state.rooms * PRICING_RULES.pricePerRoom) +
        (state.bathrooms * PRICING_RULES.pricePerBathroom);
    // Service multiplier
    subtotal *=
        PRICING_RULES.serviceTypes[
            state.serviceType
        ].multiplier;
    // Add-ons
    let addonTotal = 0;
    state.selectedAddons.forEach(id => {
        const addon =
            PRICING_RULES.addons.find(
                item => item.id === id
            );
        if(addon){
            addonTotal += addon.price;
        }
    });
    subtotal += addonTotal;
    // Discount
    const discount =
        PRICING_RULES.discounts[
            state.frequency
        ].value;
    finalPriceCalculated =
        Math.round(
            subtotal * (1 - discount)
        );
    animatePrice(finalPriceCalculated);
}

/* PRICE ANIMATION */
function animatePrice(target){
    let current =
        Number(totalPrice.textContent) || 0;
    const difference =
        target - current;
    if(difference === 0){
        return;
    }
    const increment =
        difference / 20;
    const timer = setInterval(()=>{
        current += increment;
        if(
            (increment > 0 && current >= target)
            ||
            (increment < 0 && current <= target)
        ){
            current = target;
            clearInterval(timer);
        }
        totalPrice.textContent =
            Math.round(current);
    },15);
}

/* PRICE BREAKDOWN */
function getPriceBreakdown(){
    let base =
        PRICING_RULES.basePrice;
    let rooms =
        state.rooms *
        PRICING_RULES.pricePerRoom;
    let bathrooms =
        state.bathrooms *
        PRICING_RULES.pricePerBathroom;
    let multiplier =
        PRICING_RULES.serviceTypes[
            state.serviceType
        ].multiplier;
    let addons = 0;
    state.selectedAddons.forEach(id=>{
        const addon =
            PRICING_RULES.addons.find(
                item=>item.id===id
            );
        if(addon){
            addons += addon.price;
        }
    });
    let subtotal =
        (base + rooms + bathrooms)
        * multiplier;
    subtotal += addons;
    let discount =
        PRICING_RULES.discounts[
            state.frequency
        ].value;
    return {
        base,
        rooms,
        bathrooms,
        multiplier,
        addons,
        subtotal,
        discount,
        total:finalPriceCalculated
    };
}

/* WHATSAPP BOOKING */
function sendWhatsAppMessage() {
    const service =
        PRICING_RULES.serviceTypes[state.serviceType];
    const frequency =
        PRICING_RULES.discounts[state.frequency];
    const addonList =
        state.selectedAddons.length > 0
        ? state.selectedAddons
            .map(id => {
                const addon =
                    PRICING_RULES.addons.find(
                        item => item.id === id
                    );
                return `• ${addon.label}`;
            })
            .join("\n")
        : "• None";
    const message =
`Hi ${CLIENT_CONFIG.businessName}!
I'd like to book a cleaning service.
📋 BOOKING DETAILS
🏠 Bedrooms: ${state.rooms}
🛁 Bathrooms: ${state.bathrooms}
🧹 Service:
${service.label}
📅 Frequency:
${frequency.label}
✨ Add-ons:
${addonList}
💰 Estimated Price:
${finalPriceCalculated}
Please let me know your next available appointment.
Thank you!`;
    const url =
        `https://wa.me/${CLIENT_CONFIG.phone}?text=${encodeURIComponent(message)}`;
    window.open(url,"_blank");
}
/* COPY PROTECTION */
document.addEventListener("contextmenu", e => {
    e.preventDefault();
});

document.addEventListener("keydown", e => {
    // F12
    if(e.key === "F12"){
        e.preventDefault();
    }
    // Ctrl + Shift + I
    if(
        e.ctrlKey &&
        e.shiftKey &&
        e.key.toLowerCase() === "i"
    ){
        e.preventDefault();
    }
    // Ctrl + Shift + J
    if(
        e.ctrlKey &&
        e.shiftKey &&
        e.key.toLowerCase() === "j"
    ){
        e.preventDefault();
    }
    // Ctrl + U
    if(
        e.ctrlKey &&
        e.key.toLowerCase() === "u"
    ){
        e.preventDefault();
    }
});

/* OPTIONAL HELPERS */
function resetCalculator(){
    state.rooms = 2;
    state.bathrooms = 1;
    state.serviceType = "standard";
    state.selectedAddons = [];
    state.frequency = "once";
    roomsDisplay.textContent = state.rooms;
    bathsDisplay.textContent = state.bathrooms;
    updateActiveButtons();
    calculatePrice();
}

/* START APPLICATION */
window.addEventListener("load", () => {
    updateActiveButtons();
    calculatePrice();
});