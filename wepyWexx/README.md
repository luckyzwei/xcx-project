小程序组件化开发框架--wepy

好物来秒杀应用wepy框架

### WePY项目的创建与使用

全局安装或更新WePY命令行工具

> npm install wepy-cli -g

在开发目录中生成Demo开发项目, 1.7.0之后版本请移步[wepy-cli](https://tencent.github.io/wepy/document.html#/./doc.cli)文档

> wepy new myproject
# 1.7.0之后的版本使用 wepy init standard myproject 初始化项目，使用 wepy list 查看项目模板

切换至项目目录
>cd myproject

安装依赖
>npm  install

开启实时编译
> wepy build --watch


### WePY项目的目录结构

```
├── dist                   小程序运行代码目录（该目录由WePY的build指令自动编译生成，请不要直接修改该目录下的文件）
├── node_modules           
├── src                    代码编写的目录（该目录为使用WePY后的开发目录）
|   ├── components         WePY组件目录（组件不属于完整页面，仅供完整页面或其他组件引用）
|   |   ├── com_a.wpy      可复用的WePY组件a
|   |   └── com_b.wpy      可复用的WePY组件b
|   ├── pages              WePY页面目录（属于完整页面）
|   |   ├── index.wpy      index页面（经build后，会在dist目录下的pages目录生成index.js、index.json、index.wxml和index.wxss文件）
|   |   └── other.wpy      other页面（经build后，会在dist目录下的pages目录生成other.js、other.json、other.wxml和other.wxss文件）
|   └── app.wpy            小程序配置项（全局数据、样式、声明钩子等；经build后，会在dist目录下生成app.js、app.json和app.wxss文件）
└── package.json           项目的package配置
```
