const basename = require("path").basename;

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
                    const filename = basename(state.file.opts.filename); // index.js
                    const location = `${filename} ${path.node.loc.start.line}:${path.node.loc.start.column}`; // 7:8

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
                        const window = t.identifier('window'); // window
                        const my_console = t.memberExpression(window, t.identifier('my_console')); // window.my_console
                        const args = [t.stringLiteral(path.node.callee.property.name), t.stringLiteral(location), ...path.node.arguments]; // "log", "index.js 7:8", ...args
                        const expression = t.callExpression(my_console, args); // window.my_console(method, location, ...args)
                        path.replaceWith(expression); // replace expression
                    }
                }
            }
        }
    };
}
