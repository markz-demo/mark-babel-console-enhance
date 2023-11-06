const logCacheList = [];

const logger = {
    log: function (method, location, ...args) {
        const date = new Date().toLocaleString();
        // 存入cache
        logCacheList.push({ method, date, location, args });
    },
    print: function () {
        // 遍历cache，console输出
        logCacheList.forEach(({ method, date, location, args }) => {
            window.console[method](`[${date}] [${location}]`, ...args);
        });
    },
    export: function () {
        // 定义csv header，一共5列：number,type,date,location,message
        const header = ['number', 'type', 'date', 'location', 'message'];
        // 遍历cache生成csv格式数据，比如："0","log","2023/11/6 16:52:53","index.js 9:8","123"
        const logs = logCacheList.map(({ method, date, location, args }, i) =>
            [i, method, date, location, ...args].map(v => {
                if (typeof v === 'object') {
                    v = JSON.stringify(v);
                }
                v = String(v).replaceAll(`"`, `'`);
                return '"' + v + '"';
            }).join(',')
        );
        const content = [header, ...logs].join('\n');
        const blob = new Blob([content], { type: 'text/plain,charset=UTF-8' }); // 生成blob
        const url = URL.createObjectURL(blob); // 转换成url

        // 通过a标签的download属性，调起浏览器下载
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'log.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    },
};

window._logger = logger; // 为了允许在f12 console里print或export
export default logger;