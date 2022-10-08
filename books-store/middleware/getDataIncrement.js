const axios = require('axios')

module.exports = {
    getData: async (id) => {
        try {
            return item = await axios
                .get(`http://counter:3002/counter/${id}/incr`)
                .then(resp => {
                    return resp.data
                })
        } catch(e) {
            return 'Данные не найдены'
        }
    }
}