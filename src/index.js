(function () {

    const btn1 = document.createElement('button');
    btn1.textContent = 'button1';
    document.body.appendChild(btn1);
    btn1.onclick = function () {
        console.log(123);
        console.warn('abc');
        console.log(123, 'abc', true, [1, 2, 3], { key: 'value' });
    }

})();

window.my_console = function (method, location, ...args) {
    const prefix = `[${new Date().toLocaleString()}] [${location}]`;
    console[method](prefix, ...args);
}