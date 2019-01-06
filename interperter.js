const fs = require('fs');
var readlineSync = require('readline-sync');

var file = "cat.laser"
var data;
var data2;
var data3 = [];

var laserX = 0;
var laserY = 0;
var laserBrightness = 0;
var laserColor = "";
var laserDirection = 0; // 0:> 1:V 2:< 3:^
var keyboardBuffer = "";
var loopDepth = 0;

var vars = {
    colors: [

    ],
    brightnesses: [

    ]
}

var loops = []; // {type:0,value:1,x:0,y:0[,top:0,bottom:0]}

data = fs.readFileSync(file, 'utf8');
data2 = data.replace(/\r/g, '').split("\n");
for (var i = 0; i < data2.length; i++) {
    data3.push(data2[i].split(''));
}

for (var i = 0; i < data2.length; i++) {
    for (var j = 0; j < data2[i].length; j++) {
        if (data3[i][j] == '~') {
            laserX = j;
            laserY = i;
            break;
        }
    }
}

while (data3[laserY][laserX] != '`') {
    var move = true;
    switch (data3[laserY][laserX]) {
        case '/':
            if (laserDirection == 0) {
                laserDirection = 3;
            } else if (laserDirection == 1) {
                laserDirection = 2;
            } else if (laserDirection == 2) {
                laserDirection = 1;
            } else if (laserDirection == 3) {
                laserDirection = 0;
            }
            break;
        case '\\':
            if (laserDirection == 0) {
                laserDirection = 1;
            } else if (laserDirection == 1) {
                laserDirection = 0;
            } else if (laserDirection == 2) {
                laserDirection = 3;
            } else if (laserDirection == 3) {
                laserDirection = 2;
            }
            break;
        case '^':
            laserDirection = 3;
            break;
        case 'V':
            laserDirection = 1;
            break;
        case '<':
            laserDirection = 2;
            break;
        case '>':
            laserDirection = 0;
            break;
        case '@':
            if (laserDirection == 0) {
                // No command set
            } else if (laserDirection == 1) {
                var Cnum = '';
                for (var i = laserX + 1; i < data3[laserY].length - laserX + 1; i++) {
                    if (!isNaN(data3[laserY][laserX + (i - laserX)])) {
                        Cnum += data3[laserY][laserX + (i - laserX)];
                    } else {
                        break;
                    }
                }
                laserBrightness = parseFloat(Cnum);
            } else if (laserDirection == 2) {
                console.log(laserColor);
            } else if (laserDirection == 3) {
                laserColor = data3[laserY][laserX + 1];
            }
            break;
        case '+':
            if (laserDirection == 0) {
                // No command set
            } else if (laserDirection == 1) {
                var Cnum = '';
                for (var i = laserX + 1; i < data3[laserY].length - laserX + 1; i++) {
                    if (!isNaN(data3[laserY][laserX + (i - laserX)])) {
                        Cnum += data3[laserY][laserX + (i - laserX)];
                    } else {
                        return;
                    }
                }
                laserBrightness += parseFloat(Cnum);
            } else if (laserDirection == 2) {
                // No command set
            } else if (laserDirection == 3) {
                laserColor += data3[laserY][laserX + 1];
            }
            break;
        case '-':
            if (laserDirection == 0) {
                if (data3[laserY][laserX + 1] == laserColor) {
                    laserDirection == 3;
                } else {
                    laserDirection == 1;
                }
            } else if (laserDirection == 1) {
                var Cnum = '';
                for (var i = laserX + 1; i < data3[laserY].length - laserX + 1; i++) {
                    if (!isNaN(data3[laserY][laserX + (i - laserX)])) {
                        Cnum += data3[laserY][laserX + (i - laserX)];
                    } else {
                        return;
                    }
                }
                laserBrightness -= parseFloat(Cnum);
            } else if (laserDirection == 2) {
                // No command set
            } else if (laserDirection == 3) {
                laserColor.substring(0, laserColor.length - 1);
            }
            break;
        case '*':
            if (laserDirection == 0) {
                // No command set
            } else if (laserDirection == 1) {
                var Cnum = '';
                for (var i = laserX + 1; i < data3[laserY].length - laserX + 1; i++) {
                    if (!isNaN(data3[laserY][laserX + (i - laserX)])) {
                        Cnum += data3[laserY][laserX + (i - laserX)];
                    } else {
                        return;
                    }
                }
                laserBrightness *= parseFloat(Cnum);
            } else if (laserDirection == 2) {
                // No command set
            } else if (laserDirection == 3) {
                // No command set
            }
            break;
        case '%':
            if (laserDirection == 0) {
                // No command set
            } else if (laserDirection == 1) {
                var Cnum = '';
                for (var i = laserX + 1; i < data3[laserY].length - laserX + 1; i++) {
                    if (!isNaN(data3[laserY][laserX + (i - laserX)])) {
                        Cnum += data3[laserY][laserX + (i - laserX)];
                    } else {
                        return;
                    }
                }
                laserBrightness /= parseFloat(Cnum);
            } else if (laserDirection == 2) {
                // No command set
            } else if (laserDirection == 3) {
                // No command set
            }
            break;
        case '$':
            if (laserDirection == 0) {
                // No command set
            } else if (laserDirection == 1) {
                var found = false;
                var i;
                for (i = 0; i < vars.brightnesses.length; i++) {
                    try {
                        if (vars.brightnesses[i].name == data3[laserY][laserX + 1]) {
                            found = true;
                            laserColor = vars.brightnesses[i].value;
                            break;
                        }
                    } catch (e) { }
                }

                if (found) {
                    vars.brightnesses[i].value = laserBrightness;
                } else {
                    vars.brightnesses.push({ name: data3[laserY][laserX + 1], value: laserBrightness });
                }
            } else if (laserDirection == 2) {
                console.log(laserBrightness);
            } else if (laserDirection == 3) {
                var found = false;
                var i;
                for (i = 0; i < vars.colors.length; i++) {
                    try {
                        if (vars.colors[i].name == data3[laserY][laserX + 1]) {
                            found = true;
                            laserColor = vars.colors[i].value;
                            break;
                        }
                    } catch (e) { }
                }

                if (found) {
                    vars.colors[i].value = laserColor;
                } else {
                    vars.colors.push({ name: data3[laserY][laserX + 1], value: laserColor });
                }
            }
            break;
        case '=':
            if (laserDirection == 0) {
                // No command set
            } else if (laserDirection == 1) {
                // No command set
            } else if (laserDirection == 2) {
                laserColor = keyboardBuffer.charAt(0);
                keyboardBuffer.substring(1, keyboardBuffer.length);
            } else if (laserDirection == 3) {
                // No command set
            }
            break;
        case '|':
            if (laserDirection == 0) {
                var Cnum = '';
                for (var i = laserX + 1; i < data3[laserY].length - laserX + 1; i++) {
                    if (!isNaN(data3[laserY][laserX + (i - laserX)])) {
                        Cnum += data3[laserY][laserX + (i - laserX)];
                    } else {
                        return;
                    }
                }

                if (parseFloat(Cnum) > laserBrightness) {
                    laserDirection == 3;
                } else if (parseFloat(Cnum) < laserBrightness) {
                    laserDirection == 1;
                } else {
                    laserDirection == 0;
                }
            } else if (laserDirection == 1) {
                // No command set
            } else if (laserDirection == 2) {
                // No command set
            } else if (laserDirection == 3) {
                // No command set
            }
            break;
        case '&':
            if (laserDirection == 0) {
                var found = false;
                for (var i = 0; i < vars.colors.length; i++) {
                    try {
                        if (vars.colors[i].name == data3[laserY][laserX + 1]) {
                            found = true;
                            laserColor = vars.colors[i].value;
                            break;
                        }
                    } catch (e) { }
                }

                for (var i = 0; i < vars.brightnesses.length; i++) {
                    try {
                        if (vars.brightnesses[i].name == data3[laserY][laserX + 1]) {
                            found = true;
                            laserBrightness = vars.brightnesses[i].value;
                            break;
                        }
                    } catch (e) { }
                }

                if (!found) {
                    throw new Error("REFERENCE ERROR: CANNOT REFERENCE VARIABLE " + data3[laserY][laserX + 1] + " THAT HAS NOT BEEN DEFINED");
                }
            } else if (laserDirection == 1) {
                // No command set
            } else if (laserDirection == 2) {
                // No command set
            } else if (laserDirection == 3) {
                // No command set
            }
        case '{':
            if (laserDirection == 0) {
                var Cnum = '';
                for (var i = laserX + 1; i < data3[laserY].length - laserX + 1; i++) {
                    if (!isNaN(data3[laserY][laserX + (i - laserX)])) {
                        Cnum += data3[laserY][laserX + (i - laserX)];
                    } else {
                        return;
                    }
                }

                loops.push({ type: 0, value: parseFloat(Cnum), x: laserX, y: laserY });
                loopDepth++;
            } else if (laserDirection == 1) {
                // No command set
            } else if (laserDirection == 2) {
                // No command set
            } else if (laserDirection == 3) {
                // No command set
            }
        case '(':
            if (laserDirection == 0) {
                var Cnum = '';
                for (var i = laserX + 1; i < data3[laserY].length - laserX + 1; i++) {
                    if (!isNaN(data3[laserY][laserX + (i - laserX)])) {
                        Cnum += data3[laserY][laserX + (i - laserX)];
                    } else {
                        return;
                    }
                }

                loops.push({ type: 1, value: parseFloat(Cnum), x: laserX, y: laserY });
                loopDepth++;
            } else if (laserDirection == 1) {
                // No command set
            } else if (laserDirection == 2) {
                // No command set
            } else if (laserDirection == 3) {
                // No command set
            }
        case '[':
            if (laserDirection == 0) {
                var Cnum = '';
                for (var i = laserX + 1; i < data3[laserY].length - laserX + 1; i++) {
                    if (!isNaN(data3[laserY][laserX + (i - laserX)])) {
                        Cnum += data3[laserY][laserX + (i - laserX)];
                    } else {
                        return;
                    }
                }
                var Cnum2 = '';
                for (var i = laserX; i < data3[laserY].length - laserX; i++) {
                    if (!isNaN(data3[laserY - 1][laserX + (i - laserX)])) {
                        Cnum2 += data3[laserY - 1][laserX + (i - laserX)];
                    } else {
                        return;
                    }
                }
                var Cnum3 = '';
                for (var i = laserX; i < data3[laserY].length - laserX; i++) {
                    if (!isNaN(data3[laserY + 1][laserX + (i - laserX)])) {
                        Cnum3 += data3[laserY + 1][laserX + (i - laserX)];
                    } else {
                        return;
                    }
                }

                loops.push({ type: 2, value: parseFloat(Cnum), x: laserX, y: laserY, top: parseFloat(Cnum2), bottom: parseFloat(Cnum3) });
                loopDepth++;
            } else if (laserDirection == 1) {
                // No command set
            } else if (laserDirection == 2) {
                // No command set
            } else if (laserDirection == 3) {
                // No command set
            }
        case ']':
            if (laserDirection == 0) {
                if (loopDepth > 0) {
                    if (loops[loopDepth - 1].type == 0) {
                        if (loops[loopDepth - 1].value < laserBrightness) {
                            laserX = loops[loopDepth - 1].x;
                            laserY = loops[loopDepth - 1].y;
                        } else {
                            loops.splice(loopDepth - 1, 1);
                            loopDepth--;
                        }
                    } else if (loops[loopDepth - 1].type == 1) {
                        if (loops[loopDepth - 1].value > laserBrightness) {
                            laserX = loops[loopDepth - 1].x;
                            laserY = loops[loopDepth - 1].y;
                        } else {
                            loops.splice(loopDepth - 1, 1);
                            loopDepth--;
                        }
                    } else {
                        if (loops[loopDepth - 1].top > loops[loopDepth - 1].bottom && loops[loopDepth - 1].top > laserBrightness) {
                            laserBrightness += loops[loopDepth - 1].value;
                            laserX = loops[loopDepth - 1].x;
                            laserY = loops[loopDepth - 1].y;
                        } else if (loops[loopDepth - 1].top < loops[loopDepth - 1].bottom && loops[loopDepth - 1].top < laserBrightness) {
                            laserBrightness += loops[loopDepth - 1].value;
                            laserX = loops[loopDepth - 1].x;
                            laserY = loops[loopDepth - 1].y;
                        } else {
                            loops.splice(loopDepth - 1, 1);
                            loopDepth--;
                        }
                    }
                } else {
                    throw new Error("SYNTAX ERROR: END LOOP MUST ACCOMPANY ONE START LOOP");
                }
            } else if (laserDirection == 1) {
                // No command set
            } else if (laserDirection == 2) {
                // No command set
            } else if (laserDirection == 3) {
                // No command set
            }
        case ':':
            var response = readlineSync.question('Input Text: ');
            laserColor = response;
    }
    if (laserDirection == 0) {
        laserX++;
    } else if (laserDirection == 1) {
        laserY++;
    } else if (laserDirection == 2) {
        laserX--;
    } else if (laserDirection == 3) {
        laserY--;
    }
} // 0:> 1:V 2:< 3:^