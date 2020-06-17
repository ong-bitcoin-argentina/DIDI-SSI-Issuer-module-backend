const defaultCard = {
    rows: [ 
        { columns: 2 }, 
        { columns: 1 }, 
        { columns: 1 }, 
        { columns: 1 }, 
        { columns: 1 } 
    ],
}

const cardLayouts = {
    "1": undefined,
    "2": undefined,
    "3": undefined,
    "4": defaultCard
}

function getCardLayout(previewType) {
    return cardLayouts[previewType] || undefined;
};

module.exports = {
    getCardLayout
}