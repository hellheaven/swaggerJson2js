const fs = require('fs')
const axios = require('axios');

const args = process.argv.slice(2)
let swaggerFile=args[0]?args[0]:'api-docs.json'
const exportFile = args[1] ? args[1] : 'apis.js'

function init() {
    swaggerFile = 'https://xcx.hawkdo.com/v2/api-docs?group=%E5%A4%96%E9%83%A8%E9%80%9A%E7%94%A8%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3'
    if (swaggerFile.match(/^https?:\/\/.*$/i)){
        axios.get(swaggerFile).then(function(res){
            analysis(res.data)
        })
    }else{
    let res = ''
    try {
        res = fs.readFileSync(swaggerFile, {
            encoding: 'utf-8'
        })
    } catch (error) {
        console.error("init -> error", error)
    }
    analysis(JSON.parse(res))
    }

}
function  analysis(data) {
    let res=''
    for (const apiName in data.paths) {
        console.log(apiName)
        let apiMethod = Object.keys(data.paths[apiName])[0]
        let apiSummary = Object.values(data.paths[apiName])[0].summary
        res += `//${apiSummary} \n export const ${apiName.match(/\w*$/)} = (data) => http.${apiMethod}("${apiName}",data);\n`
    }
    saveFile(res)
}

function saveFile(data) {
    fs.writeFile(exportFile, data.toString(), err => {
        if (err) {
            console.error(err)
        } else {
            console.log("数据写入成功！");
        }
    })
}

init()