// deno-lint-ignore-file

//* Functions for use in JavaScript
//* Use the VSCode "Better Comments" extension for easier reading & navigation
//? This list does not contain functions found in other templates

///////////////////////////////////////////////////////////////////

//*** Notes / Bloqs ***

/**
 * Duplicates notes and makes them not real, useful for hitboxing
 * @param {string} track Track of the fake notes
 * @param {number} p1 Starting beat
 * @param {number} p2 Ending beat
 * @param {number} delay Delay of the fake notes to prevent weird jump animations
 * @example fakeNotes("fakes", 20, 30, 0.01); // Creates fake notes from beat 20 to 30 with a delay of 0.01
 */
 function fakeNotes(track, p1, p2, delay) {
    if (!delay) {
        delay = 0;
    };
    let realNotes = _notes.filter(n => n._time >= p1 && n._time <= p2);
    realNotes.forEach(note => {
        let fake = JSON.parse(JSON.stringify(note));
        fake._customData = {
            _track: track,
            _interactable: false,
            _fake: true
        };
        fake._time += delay;
        _notes.push(fake);
    });
    return realNotes;
};

/**
 * Seperates note tracks by _lineIndex
 * @param {number} p1 Starting beat
 * @param {number} p2 Ending beat
 * @param {number} potentialOffset Offset of the note
 * @param {string} index0 Track of notes with _lineIndex 0
 * @param {string} index1 Track of notes with _lineIndex 1
 * @param {string} index2 Track of notes with _lineIndex 2
 * @param {string} index3 Track of notes with _lineIndex 3
 * @returns {Array} Array of notes affected 
 * @example trackOnNotesBetweenLineIndexSep(4, 6, 0, undefined, "middleLeft", "middleRight", undefined); // Sets the middle left notes to track "middleLeft" and the middle right notes to track "middleRight" between beats 4 and 6
 */
function trackOnNotesBetweenLineIndexSep(
    p1,
    p2,
    index0,
    index1,
    index2,
    index3,
    potentialOffset
) {
    filterednotes = _notes.filter(n => n._time >= p1 && n._time <= p2);
    filterednotes.forEach(object => {
        if (object._lineIndex == 0 && index0) {
            object._customData._track = index0;
        };
        if (object._lineIndex == 1 && index1) {
            object._customData._track = index1;
        };
        if (object._lineIndex == 2 && index2) {
            object._customData._track = index2;
        };
        if (object._lineIndex == 3 && index3) {
            object._customData._track = index3;
        };
        // just in case
        if (potentialOffset) {
            object._customData._noteJumpStartBeatOffset = potentialOffset;
        }
    });
    return filterednotes;
};

/**
 * Gives notes the _disableNoteGravity property between beats
 * @param {number} p1 Starting beat
 * @param {number} p2 Ending beat
 * @returns {Array} Array of notes affected
 * @example disableNoteGravity(4, 6); // Disables gravity on notes between beats 4 and 6
 */
function noGravityOnNotesBetween(p1, p2) {
    filterednotes = _notes.filter(n => n._time >= p1 && n._time <= p2);
    filterednotes.forEach(object => {
        object._customData._disableNoteGravity = true;
    });
    return filterednotes;
};

/**
 * Gives notes the _disableNoteLook property between beats
 * @param {number} p1 Starting beat
 * @param {number} p2 Ending beat
 * @returns {Array} Array of notes affected
 * @example disableNoteLook(4, 6); // Disables look on notes between beats 4 and 6
 */
function noRotateOnNotesBetween(p1, p2) {
    filterednotes = _notes.filter(n => n._time >= p1 && n._time <= p2);
    filterednotes.forEach(object => {
        object._customData._disableNoteLook = true;
    });
    return filterednotes;
};

/**
 * Gives notes the _disableSpawnEffect property between beats
 * @param {number} p1 Starting beat
 * @param {number} p2 Ending beat
 * @returns {Array} Array of notes affected
 * @example noSpawnEffectOnNotesBetween(4, 6); // Disables spawn effect on notes between beats 4 and 6
 */
function noSpawnEffectOnNotesBetween(p1, p2) {
    filterednotes = _notes.filter(n => n._time >= p1 && n._time <= p2);
    filterednotes.forEach(object => {
        object._customData._disableSpawnEffect = true;
    });
    return filterednotes;
};

/**
 * Gives notes with a track a start beat offset
 * @param {string} track Track of the notes
 * @param {number} offset Offset of the notes
 * @param {number} njs Note jump speed of the notes
 * @returns {Array} Array of notes affected
 * @example offestOnTrack("deepNotes", 8, 10); // Gives 8 offset and 10 njs to track "deepNotes"
 */
function offestOnTrack(track, offset, njs) {
    filterednotes = _notes.filter(n => n._customData._track == track);
    filterednotes.forEach(object => {
        if (offset) {
            object._customData._noteJumpStartBeatOffset = offset;
        };
        if (njs) {
            object._customData._noteJumpMovementSpeed = njs;
        };
    });
    return filterednotes;
};

//*** Walls / Obstacles ***

/**
 * Gives offset to walls between beats
 * @param {number} p1 Starting beat
 * @param {number} p2 Ending beat
 * @param {number} offset Start beat offset of the walls
 * @param {number} njs Note jump speed of the walls
 * @returns {Array} Array of walls affected
 * @example offsetWalls(4, 6, 3, 22); // Gives offset of 3 and njs of 22 to walls between beats 4 and 6
 */
function offestOnWallsBetween(p1, p2, offset, njs) {
    filteredwalls = _obstacles.filter(n => n._time >= p1 && n._time <= p2);
    filteredwalls.forEach(object => {
        // insert Mawntee joke here
        if (offset) {
            object._customData._noteJumpStartBeatOffset = offset;
        };
        if (njs) {
            object._customData._noteJumpMovementSpeed = njs;
        };
    });
    return filteredwalls;
};

/**
 * Generates a regular polygon
 * @param {string} track Track of the polygon
 * @param {number} xPos X offset of the polygon
 * @param {number} yPos Y offset of the polygon
 * @param {number} time Time of polygon
 * @param {number} radius Radius of polygon
 * @param {number} sides The number of sides the polygon has
 * @param {number} thic How thick the sides are
 * @example genPolygon("octagon", 0, 2, 20, 3, 8, 0.2); // Creates an octagon at (0, 2) at beat 20 with radius 3, thickness 0.2, and track "octagon"
 */
function genPolygon(track, xPos, yPos, time, radius, sides, thic) {
    if (!thic) {thic = 0.3};
    let angle = -90;
    let length = round((2 * radius * Math.tan(Math.PI / sides)), 4);
    // pay attention in geometry class
    for (let side = 0; side < sides; side++) {
        _obstacles.push({
            _time: time,
            _lineIndex: 0,
            _type: 0,
            _duration: 0,
            _width: 0,
            _customData: {
                _scale: [
                    length,
                    thic,
                    thic
                ],
                _position: [
                    radius * Math.cos(angle * Math.PI / 180) + xPos - length / 2,
                    radius * Math.sin(angle * Math.PI / 180) + yPos
                ],
                _animation: {
                    _localRotation: [
                        [0, 0.01, angle + 90, 0]
                    ]
                },
                _track: track
            }
        });
        angle += 360 / sides;
    };
};

/**
 * Sets obstacles with custom data to _fake true and _interactable false between beats, useful for lowering lag
 * @param {number} p1 Starting beat
 * @param {number} p2 Ending beat
 * @returns {Array} Array of obstacles affected
 * @example fakeObstacles(4, 6); // Sets obstacles with custom data between beats 4 and 6 to be fake and non interactable
 * @example fakeObstacles(); // Sets all obstacles with custom data to be fake and non interactable
 */
function fakeObstacles(p1, p2) {
    if (p1) {
        let filteredObstacles = _obstacles.filter(n => n._time >= p1 && n._time <= p2);
        filteredObstacles.forEach(object => {
            if (object._customData) {
                if (object._customData._fake !== false) {
                    object._customData._fake = true;
                };
                if (object._customData._interactable !== true) {
                    object._customData._interactable = false;
                };
            };
        });
        return filteredObstacles;
    } else { // this probably isn't the best way to do this
        _obstacles.forEach(object => {
            if (object._customData) {
                if (object._customData._fake !== false) {
                    object._customData._fake = true;
                };
                if (object._customData._interactable !== true) {
                    object._customData._interactable = false;
                };
            };
        });
        return _obstacles;
    }
};

//*** General Use ***

/**
 * Returns an array of points to make something shake with position
 * @param {number} power How far the notes will move during shake
 * @param {number} speed Time between each point in the shake
 * @returns {Array} Array of points to shake things
 */
function shakePos(power, speed) {
    let shakePoints = [];
    for (let t = 0; t <= 1; t += quick * 4) {
        shakePoints.push(
            [power, power, 0, t], [-power, -power, 0, t + speed], [-power, power, 0, t + speed * 2], [power, -power, 0, t + speed * 3]
        )
    }
    return shakePoints;
}

/**
 * Returns an array of points to make something shake with rotation
 * @param {number} power How much the notes will rotate during shake
 * @param {number} speed Time between each point in the shake
 * @returns {Array} Array of points to shake things
 */
 function shakeRot(power, speed) {
    let shakePoints = [];
    for (let t = 0; t <= 1; t += quick * 4) {
        shakePoints.push(
            [power, power, power, t], [-power, -power, -power, t + speed], [-power, power, power, t + speed * 2], [power, -power, -power, t + speed * 3]
        )
    }
    return shakePoints;
}

/**
 * Gets a random color
 * @returns {Array} Array of three random 0-1 values
 */
const randomColor = () => [Math.random(), Math.random(), Math.random()];

/**
 * Have objects come into the area invisible
 * @param {string} track Track that's coming in
 * @param {number} entering What time the track will appear
 * @param {number} duration The length of the fade time
 * @example comeInSilent("text", 28, 0.5); // The track "text" will enter hidden at beat 28
 */
 function comeInSilent(track, entering, duration) {
    _customEvents.push({
        _time: entering - 10,
        _type: "AnimateTrack",
        _data: {
            _track: track,
            _dissolve: "gone"
        }
    }, {
        _time: entering,
        _type: "AnimateTrack",
        _data: {
            _track: track,
            _dissolve: "appear", //? requires a point definition
            _duration: duration
        }
    });
};

/**
 * Have notes come into the area invisible
 * @param {string} track Track that's coming in
 * @param {number} entering What time the notes will appear
 * @param {number} duration The length of the fade time
 * @example comeInSilentNote("text", 28, 0.5); // The notes with track "text" will enter hidden at beat 28
 */
function comeInSilentNote(track, entering, duration) {
    _customEvents.push({
        _time: entering - 10,
        _type: "AnimateTrack",
        _data: {
            _track: track,
            _dissolve: "gone",
            _dissolveArrow: "gone"
        }
    }, {
        _time: entering,
        _type: "AnimateTrack",
        _data: {
            _track: track,
            _dissolve: "appear", //? requires a point definition
            _dissolveArrow: "appear", //?
            _duration: duration
        }
    });
};

/**
 * Have objects come into the area invisible and stay there
 * @param {string} track Track that's coming in
 * @param {number} entering What time the track will appear
 * @param {number} duration The length of the fade time
 * @example stayInSilent("text", 28, 0.5); // The track "text" will enter hidden at beat 28 and stay at time 0.5
 */
function stayInSilent(track, entering, duration) {
    _customEvents.push({
        _time: entering - 10,
        _type: "AnimateTrack",
        _data: {
            _track: track,
            _dissolve: "gone"
        }
    }, {
        _time: entering,
        _type: "AnimateTrack",
        _data: {
            _track: track,
            _dissolve: "appear", //? requires a point definition
            _time: "hold",
            _duration: duration
        }
    });
};

/**
 * Have notes come into the area invisible and stay there
 * @param {string} track Track that's coming in
 * @param {number} entering What time the notes will appear
 * @param {number} duration The length of the fade time
 * @example stayInSilentNote("text", 28, 0.5); // The notes with track "text" will enter hidden at beat 28 and stay at time 0.5
 */
function stayInSilentNote(track, entering, duration) {
    _customEvents.push({
        _time: entering - 10,
        _type: "AnimateTrack",
        _data: {
            _track: track,
            _dissolve: "gone",
            _dissolveArrow: "gone"
        }
    }, {
        _time: entering,
        _type: "AnimateTrack",
        _data: {
            _track: track,
            _dissolve: "appear", //? requires a point definition
            _dissolveArrow: "appear", //?
            _time: "hold",
            _duration: duration
        }
    });
};

/**
 * Have objects despawn at a certain time
 * @param {string} track Track that's leaving
 * @param {number} leaving Time the track will leave
 * @param {number} duration The length of the fade time
 */
function leave(track, leaving, duration) {
    _customEvents.push({
        _time: leaving,
        _type: "AnimateTrack",
        _data: {
            _track: track,
            _dissolve: "gone",
            _duration: duration
        }
    }, {
        _time: leaving + duration,
        _type: "AnimateTrack",
        _data: {
            _track: track,
            _time: [1.1] //? you might want to change this
        }
    });
};

//*** Other Stuff ***

const bpm = 150; //! NOTICE: if you're using a template, you could have this defined already
/**
 * Finds the duration of something after a BPM change
 * @param {number} newBPM The new BPM from a BPM change
 * @param {number} duration Duration of how long it *should* be
 * @returns {number} Duration for the starting BPM
 * @example dur(170,1); // The new BPM is 170, and this gives what a duration of 1 should be
 */
const dur = (newBPM, duration) => bpm / newBPM * duration;

/**
 * Chance that something will happen
 * @param {number} percent The percentange of returning true (0-1)
 * @returns {boolean} If the {@link percent} was hit
 * @example percentChance(0.75); // 75% chance of returning true
 */
const percentChance = (percent) => Math.random() <= percent;