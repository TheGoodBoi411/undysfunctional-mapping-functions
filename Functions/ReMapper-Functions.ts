// deno-lint-ignore-file
import { Difficulty, notesBetween } from "https://deno.land/x/remapper@2.0.0/src/mod.ts";
import * as r from "https://deno.land/x/remapper@2.0.0/src/mod.ts";
const map = new Difficulty("ExpertPlusLawless.dat", "ExpertPlusStandard.dat");

///////////////////////////////////////////////////////////////////

//* Functions for use in ReMapper with TypeScript
//* Use the VSCode "Better Comments" extension for easier reading & navigation
//? This list will be updated more often than the JS functions

///////////////////////////////////////////////////////////////////

//*** Notes / Bloqs ***

/**
 * @use **Assign a track to notes in a range**
 * @param track The track to assign notes to
 * @param start Starting beat of notes to assign
 * @param end Ending beat of notes to assign
 * @param offset Set the _noteJumpStartBeatOffset of assigned notes if wanted
 * @param njs Set the _noteJumpMovementSpeed of assigned notes if wanted
 * @example trackNotes("start", 4, 16, 0.5); // Notes between beats 4 and 16 will be given the track "start" and have an offest of 0.5
 */
function trackNotes (track:string, start:number, end:number, offset?:number, njs?:number) {
    notesBetween(start, end, note => {
        note.customData._track = track;
        if (offset) { note.customData._noteJumpStartBeatOffset = offset; };
        if (njs) { note.customData._noteJumpMovementSpeed = njs; };
    });
};

/**
 * @use **Assign seperate tracks to red and blue notes**
 * @param trackR Track for red notes
 * @param trackB Track for blue notes
 * @param start Start beat
 * @param end End beat
 * @param offset Offset of notes if wanted
 * @param njs Note jump speed of notes if wanted
 * @example trackNotes("fadeR", "fadeB", 4, 16);
 */
function trackNotesRB (trackR:string, trackB:string, start:number, end:number, offset?:number, njs?:number) {
    notesBetween(start, end, note => {
        if (note.type == 0) {
            note.customData._track = trackR;
        } else {
            note.customData._track = trackB;
        };
        if (offset) { note.customData._noteJumpStartBeatOffset = offset; };
        if (njs) { note.customData._noteJumpMovementSpeed = njs; };
    });
};

/**
 * @use **Duplicate notes to be used in other ways such as hitboxing**
 * @param start Start beat
 * @param end End Beat
 * @param newTrack Track given to fake notes
 * @param delay Time delay for the new notes to prevent weird gravity
 * @param fake If the notes will be _fake: true and _interactable: false
 * @example dupeNotes(10, 14, "smallFakes", 0.01, true);
 */
function dupeNotes (start:number, end:number, newTrack:string, delay?:number, fake?:boolean) {
    if (!delay) { delay = 0; };
    notesBetween(start, end, note => {
        let neww = JSON.parse(JSON.stringify(note));
        
        neww.json._time += delay;
        if (fake) {
            neww.json._customData = {
                _track: newTrack,
                _interactable: false,
                _fake: true,
                _disableSpawnEffect: true
            };
        };
        map.notes.push(neww);
    });
};

//*** General Use ***

/**
 * @use **Create a set of point definitions for shaking things**
 * @param pow How much to shake
 * @param quick Delay between points
 * @param threeD If the shaking is 3d instead of 2d
 * @returns {Array} An array of shake points
 * @example shake(0.2, 0.125);
 */
function shake(pow:number, quick:number, threeD?:boolean) {
    let shakePoints = [];
    if (!threeD) {
        for (let time = 0; time <= 1; time += quick * 4) {
            shakePoints.push(
                [ pow,  pow, 0, time],
                [-pow, -pow, 0, time + quick],
                [-pow,  pow, 0, time + quick * 2],
                [ pow, -pow, 0, time + quick * 3]
            );
        };
    } else {
        for (let time = 0; time <= 1; time += quick * 8) {
            shakePoints.push(
                [-pow, -pow, -pow, time],
                [ pow, -pow, -pow, time + quick],
                [-pow, -pow,  pow, time + quick * 2],
                [ pow, -pow,  pow, time + quick * 3],
                [-pow,  pow, -pow, time + quick * 4],
                [ pow,  pow, -pow, time + quick * 5],
                [-pow,  pow,  pow, time + quick * 6],
                [ pow,  pow,  pow, time + quick * 7]
            );
        };
    };
    while (shakePoints[shakePoints.length - 1][3] > 1) { shakePoints.pop() };
    return shakePoints;
};