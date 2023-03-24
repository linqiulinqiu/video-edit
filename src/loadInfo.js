import queryString from "query-string";
import axios from "axios"

function getSid() {
    console.log('this. = ',this)
    const query = queryString.parse(location.search)
    if ('sid' in query) {
        return query.sid
    } else {
        return false
    }
}
async function getInfo(url) {
    // const path = url + sid
    const res = await axios.get(url)
    console.log('loadInfo res = ', res)
    return res
}
export default {
    getSid: getSid,
    getInfo:getInfo
}