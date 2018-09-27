import RNFS from "react-native-fs";

function getDaysInOneMonth(year, month) {
    var d = new Date(year, month, 0);
    return d.getDate();
}

function writeFile(scheduleItem, fileName) {
    let path = RNFS.DocumentDirectoryPath + '/' + fileName;
    RNFS.readFile(path, 'utf8')
        .then((res) => {
            // let Temp  = res.replace(/hello/g,'hi');
            RNFS.writeFile(path, res + scheduleItem, 'utf8')
                .then((success) => {
                    alert('success')
                })
                .catch((err) => {
                    console.log(err.message);
                });
        })
        .catch((error) => {
            console.warn(error)
        });
}

function readFile(fileName) {
    let path = RNFS.DocumentDirectoryPath + '/' + fileName;
    RNFS.readFile(path, 'utf8')
        .then((res) => {
            this.readFileReturn(res)

        })
        .catch((error) => {
            console.warn(error)
        });

}
function readFileReturn(res) {
    return res
}

export default module.export = {
    getDaysInOneMonth,
    readFile,
    writeFile,
}