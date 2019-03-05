function isSameValue(valueMap, lastValues, props) {
    for (var i = 0; i < props.length; i++) {
        if (valueMap[props[i]] !== lastValues[i]) {
            return false;
        }
    }
    return true;
}

function saveValue(valueMap, lastValues, props) {
    for (var i = 0; i < props.length; i++) {
        lastValues[i] = valueMap[props[i]];
    }
}

function processTimeLine(timelineMap, props) {
    var newTimeLine = [];
    var lastValues = [];
    for (var i = 0; i < props.length; i++) {
        lastValues[i] = 'undefined';
    }
    var lastValueMap = null;
    for (var i = 0; i < timelineMap.length; i++) {
        var valueMap = timelineMap[i];
        if (!isSameValue(valueMap, lastValues, props)) {
            if (lastValueMap && isSameValue(lastValueMap, lastValues, props)) {
                newTimeLine.push(lastValueMap);
                lastValueMap = null;
            }
            newTimeLine.push(valueMap);
            saveValue(valueMap, lastValues, props);
        } else {
            lastValueMap = valueMap;
        }
    }
    return newTimeLine;
}

function processOneAnim(map, name) {
    if (map.slots) {
        for (var slotName in map.slots) {
            var slotMap = map.slots[slotName];
            for (var timelineName in slotMap) {
                var timelineMap = slotMap[timelineName];
                if (timelineName == "color") {
                    slotMap[timelineName] = processTimeLine(timelineMap, ['color', 'curve']);
                }
                else if (timelineName = "attachment") {
                    slotMap[timelineName] = processTimeLine(timelineMap, ['name']);
                }
            }
        }
    }

    if (map.bones) {
        for (var boneName in map.bones) {
            var boneMap = map.bones[boneName];
            for (var timelineName in boneMap) {
                var timelineMap = boneMap[timelineName];
                if (timelineName === "rotate") {
                    boneMap[timelineName] = processTimeLine(timelineMap, ['angle', 'curve']);
                }
                else if (timelineName === "translate" || timelineName === "scale" || timelineName === "shear") {
                    boneMap[timelineName] = processTimeLine(timelineMap, ['x', 'y', 'curve']);
                }
            }
        }
    }

    if (map.ik) {
        for (var constraintName in map.ik) {
            var constraintMap = map.ik[constraintName];
            map.ik[constraintName] = processTimeLine(constraintMap, ['mix', 'bendPositive', 'curve']);
        }
    }

    if (map.transform) {
        for (var constraintName in map.transform) {
            var constraintMap = map.transform[constraintName];
            map.transform[constraintName] = processTimeLine(constraintMap, ['rotateMix', 'translateMix', 'scaleMix', 'shearMix', 'curve'])
        }
    }

    if (map.paths) {
        for (var constraintName in map.paths) {
            var constraintMap = map.paths[constraintName];
            for (var timelineName in constraintMap) {
                var timelineMap = constraintMap[timelineName];
                if (timelineName === "position" || timelineName === "spacing") {
                    constraintMap[timelineName] = processTimeLine(timelineMap, ['timelineName', 'curve'])
                }
                else if (timelineName === "mix") {
                    constraintMap[timelineName] = processTimeLine(timelineMap, ['rotateMix', 'translateMix', 'curve'])
                }
            }
        }
    }

    if (map.deform) {
        //skip
    }

    var drawOrderNode = map.drawOrder;
    if (drawOrderNode == null)
        drawOrderNode = map.draworder;
    if (drawOrderNode != null) {
        //skip
    }

    if (map.events) {
        //skip
    }
}

module.exports = {
    processOneAnim : processOneAnim,
}