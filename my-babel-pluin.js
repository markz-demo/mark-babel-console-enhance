const basename = require("path").basename;
const { addDefault } = require("@babel/helper-module-imports");

module.exports = (babel) => {
    const { types: t, template } = babel;
    return {
        name: 'test-log',
        visitor: {
            CallExpression(path, state) {
                if (t.isMemberExpression(path.node.callee) // 判断是不是对象成员，比如console.log
                    && path.node.callee.object.name === 'console'
                    && ['log', 'info', 'warn', 'error'].includes(path.node.callee.property.name)
                ) {
                    const filename = basename(state.file.opts.filename); // 获取文件名 比如index.js
                    const location = `${filename} ${path.node.loc.start.line}:${path.node.loc.start.column}`; // 获取console调用位置 比如7:8

                    // solution1
                    {
                        // const date = t.identifier('Date'); // Date
                        // const newDate = t.newExpression(date, []); // new Date()
                        // const toString = t.memberExpression(newDate, t.identifier('toLocaleString')); // new Date().toLocaleString
                        // const localDate = t.callExpression(toString, []); // new Date().toLocaleString()

                        // const left = t.binaryExpression("+", t.stringLiteral("["), localDate); // "[" + new Date().toLocaleString()
                        // const right = t.stringLiteral(`] [${location}]`); // "] [index.js 7:8]"
                        // const expression = t.binaryExpression("+", left, right); // "[" + new Date().toLocaleString() + "] [index.js 7:8]"

                        // path.node.arguments.unshift(expression); // console.log(expression, ...)
                    }

                    // solution2
                    {
                        // const code = `"[" + new Date().toLocaleString() + "] [${location}]"`;
                        // const expression = template.expression(code)();
                        // path.node.arguments.unshift(expression);
                    }

                    // enhance
                    {
                        // const window = t.identifier('window'); // window
                        // const my_console = t.memberExpression(window, t.identifier('my_console')); // window.my_console
                        // const args = [t.stringLiteral(path.node.callee.property.name), t.stringLiteral(location), ...path.node.arguments]; // "log", "index.js 7:8", ...args
                        // const expression = t.callExpression(my_console, args); // window.my_console(method, location, ...args)
                        // path.replaceWith(expression); // replace expression
                    }

                    // enhance using import
                    {
                        const programPath = path.hub.file.path;
                        let importTrackerId = "";
                        programPath.traverse({
                            // 解析当前文件import
                            ImportDeclaration(path) {
                                const sourceValue = path.get("source").node.value;
                                if (sourceValue === '@logger') { // 判断是否有引用@logger
                                    const specifiers = path.get("specifiers.0");
                                    // 如果当前文件有引用@logger，记录import的变量名存在importTrackerId
                                    importTrackerId = specifiers.get("local").toString();
                                    path.stop();
                                }
                            },
                        });

                        if (!importTrackerId) {
                            // 如果当前文件没有引用@logger，则需要添加一个 import _loggerXX from '@logger'，并且记录变量名存在importTrackerId
                            importTrackerId = addDefault(programPath, '@logger', {
                                nameHint: programPath.scope.generateUid("_logger"), // 会生成一个随机变量名，比如_logger2
                            }).name;
                        }
                        const window = t.identifier(importTrackerId); // 生成 _logger
                        const my_console = t.memberExpression(window, t.identifier('log')); // 生成 _logger.log
                        const args = [t.stringLiteral(path.node.callee.property.name), t.stringLiteral(location), ...path.node.arguments]; // 定义参数："log", "index.js 7:8", ...args
                        const expression = t.callExpression(my_console, args); // 把参数传入方法中 _logger.log(method, location, ...args) 
                        path.replaceWith(expression); // 替换当前console语法
                    }
                }
            }
        }
    };
}
