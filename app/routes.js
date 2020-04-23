import axios from 'axios';

const routes = {
    fetchAreas = async () => {
        await axios.get('/api/areas')
        .then((res) =>{
            return res
        })
        .catch ((error) => {
            return null
        })
    },
    fetchCities = async () => {
        await axios.get('/api/cities')
        .then((res) =>{
            return res
        })
        .catch ((error) => {
            return null
        })
    },
}

module.exports = routes;