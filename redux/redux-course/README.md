npm 会在项目的 package.json 文件中寻找 scripts 区域，其中包括npm test和npm start等命令。

其实npm test和npm start是npm run test和npm run start的简写。事实上，你可以使用npm run来运行scripts里的任何条目。

使用npm run的方便之处在于，npm会自动把node_modules/.bin加入$PATH，这样你可以直接运行依赖程序和开发依赖程序，不用全局安装了。
只要npm上的包提供命令行接口，你就可以直接使用它们，方便吧？当然，你总是可以自己写一个简单的小程序

我们这个文件中有一个example属性，其对应的就是babel-node命令，所以运行的时候这样写：npm run example 01_simple-action-creator.js

注意得先去安装babel-cli等模块来翻译es6,之后的话才会有bable-node命令,上面那个也可以运行，但是全局安装的bable-cli,使用babel-node命令运行可以，注意babelrc文件的配置

但是有的文件不能运行，因为不支持某些es6语法，如import等