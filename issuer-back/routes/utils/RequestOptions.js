module.exports = {
    get: {
        
    },
    post: (data) => {
        return {
            method: 'POST',
            body:    JSON.stringify(data),
            headers: { 
                'Content-Type': 'application/json' 
            },
        }
    },
}