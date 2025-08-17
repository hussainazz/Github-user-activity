
import yargs from 'yargs'

let userName = yargs(process.argv.slice(2)).parse()._[0]
let specifiedEventType = yargs(process.argv.slice(2)).parse()._[1]?.toLowerCase()
getUserActivity(userName)

let eventTypes = ['PushEvent', 'IssueCommentEvent', 'ForkEvent', 'WatchEvent']

async function getUserActivity(userName) {
    try {
        if(!userName) throw `emptyUserName`
        let response = await fetch(`https://api.github.com/users/${userName}/events`)
        if(response.status === 404) throw 'notFound'
        let data = await response.json()
        if(!data.length) console.log(`The user did't have any activity in the past 30 days`)
        readingData(data)
    }
    catch(error) {
        switch(error) {
            case 'notFound':
                console.error(`User name could not be found`)
                break
            case 'unavailable':
                console.error(`No internet connection`)
                break
            case 'emptyUserName':
                console.error(`User name could not be empty`)
                break
        }
    }
}

function readingData(data) {
    let specifiedEventType_fr

    var acitivityEventBased = {
        PushEvent: function(filteredData) {
            filteredData.forEach( item => console.log(`pushed ${item.payload.commits.length} commits to ${item.repo.name}`))
        },
        IssueCommentEvent: (filteredData) => {
            filteredData.forEach( item => console.log(`opened a new issue in ${item.repo.name}`))
        },
        ForkEvent: (filteredData) => {
            filteredData.forEach( item => console.log(`forked to ${item.repo.name}`))
        },
        WatchEvent: (filteredData) => {
            filteredData.forEach( item => console.log(`starred ${item.repo.name}`) )
        }
    }

    function filteredData(type) {
        return data.filter(item => item.type === type)
    }

    if(specifiedEventType) {
        switch(specifiedEventType) {
            case 'push':
                specifiedEventType_fr = 'PushEvent'
                break
            case 'issue':
                specifiedEventType_fr = 'IssueCommentEvent'
                break
            case 'fork':
                specifiedEventType_fr = 'ForkEvent'
                break
            case 'star':
                specifiedEventType_fr = 'WatchEvent'
                break
            default:
                console.error('Invalid event type')
        }
        if(!data.some(item => item.type === specifiedEventType_fr)) {
            console.error(`The user didn't do any ${specifiedEventType} event in the past 30 days`)
        }
        acitivityEventBased[specifiedEventType_fr](filteredData(specifiedEventType_fr))
    }
    else {
        eventTypes.forEach(type => acitivityEventBased[type](filteredData(type)))
    }
}