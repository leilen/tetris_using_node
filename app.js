const terminal = require('terminal-kit').terminal

const blockSize = 2;
const height = 22;
const width = 12;
const wall = '▣';
const empty = ' ';
const tetrino = '▩';
const mapStartPosition = {
    x: 3,
    y: 3
}

let mapArr = [[]];
let tetrinoXY = {
    x: 0,
    y: 0
};


function initMapArr() {
    for (let i = 0; i < height; i++) {
        mapArr[i] = [];
        for (let j = 0; j < width; j++) {
            if (i > 0 && i < height - 1 && j > 0 && j < width - 1) {
                mapArr[i][j] = 0;
            } else {
                mapArr[i][j] = 1;
            }
        }
    }
}
function initSystem() {
    const stdin = process.stdin;
    stdin.setRawMode(true);

    stdin.resume();

    stdin.on('data', function (key) {
        // console.log('key', JSON.stringify(key, null, 2))

        // ctrl-c ( end of text )
        if (key[0] === 3) {
            process.exit();
        }
        if (key.length == 3) {
            if (key[0] == 27 && key[1] == 91) {
                switch (key[2]) {
                    case 65:
                        moveTetrino(0)
                        // console.log('up');
                        break;
                    case 66:
                        moveTetrino(1)
                        // console.log('down');
                        break;
                    case 68:
                        moveTetrino(2)
                        // console.log('left');
                        break;
                    case 67:
                        moveTetrino(3)
                        // console.log('right');
                        break;
                }
            }
        }
    });
}

function clear() {
    process.stdout.write('\033c');
}
function sleep(mils) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve()
        }, mils);
    });
}
function drawMap() {
    clear();
    for (let i = 0; i < mapArr.length * blockSize; i++) {
        const v = mapArr[Math.floor(i / blockSize)];
        for (let j = 0; j < mapArr.length * blockSize; j++) {
            const w = v[Math.floor(j / blockSize)];
            let view = '';
            switch (w) {
                case 0:
                    view = empty;
                    break;
                case 1:
                    view = wall;
                    break;
                case 2:
                    view = tetrino;
                    break;
            }
            process.stdout.write(view);
        }
        process.stdout.write('\n');
    }
    terminal.hideCursor();
}
function drawPart(before, after) {

    for (let i = 0; i < blockSize; i++) {
        for (let j = 0; j < blockSize; j++) {
            terminal.moveTo(before.x * blockSize + mapStartPosition.x + i, before.y * blockSize + mapStartPosition.y + j)
            process.stdout.write(empty);
        }
    }
    for (let i = 0; i < blockSize; i++) {
        for (let j = 0; j < blockSize; j++) {
            terminal.moveTo(after.x * blockSize + mapStartPosition.x + i, after.y * blockSize + mapStartPosition.y + j)
            process.stdout.write(tetrino);
        }
    }
    terminal.hideCursor();

}
function setTetrino() {
    mapArr[1][1] = 2;
}
function moveTetrino(type) {
    const beforeXY = {
        x: tetrinoXY.x,
        y: tetrinoXY.y
    }
    mapArr[tetrinoXY.y][tetrinoXY.x] = 0;
    switch (type) {
        case 0:
            tetrinoXY.y = tetrinoXY.y - 1;
            break;
        case 1:
            tetrinoXY.y = tetrinoXY.y + 1;
            break;
        case 2:
            tetrinoXY.x = tetrinoXY.x - 1;
            break;
        case 3:
            tetrinoXY.x = tetrinoXY.x + 1;
            break;
    }
    mapArr[tetrinoXY.y][tetrinoXY.x] = 2;

    drawPart(beforeXY, tetrinoXY);
}
async function main() {
    initSystem();
    initMapArr();
    setTetrino();
    drawMap();
    // while (true) {
    //     await sleep(100);
    //     moveTetrino(1)
    // }
}

main();