
import yargs from 'yargs'

let userName = yargs(process.argv.slice(2)).parse()._[0]

async function getUserData() {
    let response = await fetch(`https://api.github.com/users/Soroushsrd/events`)
    let data = await response.json()
    console.log(data)
}
getUserData()
