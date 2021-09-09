# swaggerJson2js
用swagger的json文件生成apis.js及表单，表单组件使用[vue-json-schema-form](https://vue-json-schema-form.lljj.me/zh/guide)。


# 用法

```javascript
//可选参数，1：源文件名(默认api-docs.json,可以是网址)，2：api目标文件名（默认apis.js)
npx babel-node gen swaggerUrl
```

# 说明

输出内容可直接修改gen.js中analysis方法里的文本,模板内容，修改template.js。
template中的名字和apis.js中的方法名对应。

