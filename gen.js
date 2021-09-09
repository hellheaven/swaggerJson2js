const fs = require('fs')
const axios = require('axios');
const path = require('path')
const converter = require('swagger2openapi');
const toJsonSchema = require('@openapi-contrib/openapi-schema-to-json-schema');
import {
    Resolver
} from "@stoplight/json-ref-resolver";
const template = require('./template').vueTemplate;

const args = process.argv.slice(2)
let swaggerFile = args[0] ? args[0] : 'api-docs.json'//可以是网址
const exportFile = args[1] ? args[1] : 'apis.js'
const tarDir = 'dist/'


function init() {
    createFolder(tarDir)
    saveApi();
    SwaggerToJsonSchema()
}

function saveApi() {
    if (swaggerFile.match(/^https?:\/\/.*$/i)) {
        axios.get(swaggerFile).then(function (res) {
            analysis(res.data)
        })
    } else {
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

function analysis(data) {
    let res = ''
    for (const apiName in data.paths) {
        console.log(apiName)
        let apiMethod = Object.keys(data.paths[apiName])[0]
        let apiSummary = Object.values(data.paths[apiName])[0].summary
        res += `//${apiSummary} \n export const ${apiName.match(/\w*$/)} = (data) => http.${apiMethod}("${apiName}",data);\n`
    }
    saveFile(res)

}

function SwaggerToJsonSchema() {
    createFolder(tarDir + 'schemas/')
    let options = {
        patch: true
    };
    if (swaggerFile.match(/^https?:\/\/.*$/i)) {
        converter.convertUrl(swaggerFile, options, coverHandler);
    } else {
        converter.convertFile(swaggerFile, options, coverHandler);
    }
}
async function coverHandler(err, res) {
    const resolver = new Resolver();
    var convertedSchema = toJsonSchema(res.openapi);
    const resolved = await resolver.resolve(convertedSchema);
    let forms = resolved.result.paths
    for (const item in forms) {
        let method = Object.keys(forms[item])[0]
        if (method == 'post' && forms[item].post.requestBody) {
            let name = item.match(/\w*$/)[0]
            saveVueTemplete(name, 'schemas/' + name, JSON.stringify(forms[item].post.requestBody.content['application/json'].schema))
        }
    }
    saveFile(JSON.stringify(resolved.result), 'jsonSchema.json')
}

function saveVueTemplete(name, fileName, raw) {
    let temp = template(name, raw)
    return saveFile(temp, `${fileName}.vue`)
}

function saveFile(data, fileName) {
    let tar = tarDir + (fileName ? fileName : exportFile)
    return new Promise(reslove => {
        fs.writeFile(tar, data.toString(), err => {
            if (err) {
                console.error(err)
            } else {
                reslove('done')
                console.log(`${tar} 写入成功！`);
            }
        })
    })

}

function createFolder(pathName) {
    pathName = path.join(__dirname, pathName)
    const exists = fs.existsSync(pathName)
    if (!exists) {
        fs.mkdir(pathName, error => {
            if (error) {
                console.log(error)
            } else {
                console.log('目录创建成功！')
            }
        })
    }
}
init()