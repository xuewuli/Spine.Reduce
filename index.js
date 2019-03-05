var processOneAnim = require('./OptimizeAnim').processOneAnim;

var CmdArgs = process.argv.splice(2);

var SpineJSON = require(CmdArgs[0]);


function minify(spineData) {
    if (spineData.animations) {
        for (var animationName in spineData.animations) {
            var animationMap = spineData.animations[animationName];
            processOneAnim(animationMap, animationName);
        }
    }
    return spineData;
}

console.log(JSON.stringify(minify(SpineJSON)));