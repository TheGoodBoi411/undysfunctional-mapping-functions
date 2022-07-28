// deno-lint-ignore-file
import { Difficulty, notesBetween } from "https://deno.land/x/remapper@2.0.0/src/mod.ts";
import * as r from "https://deno.land/x/remapper@2.0.0/src/mod.ts";
const map = new Difficulty("ExpertPlusLawless.dat", "ExpertPlusStandard.dat");

/**
 * @use **Assign a track to notes in a range**
 * @param track The track to assign notes to
 * @param start Starting beat of notes to assign
 * @param end Ending beat of notes to assign
 * @param offset Set the _noteJumpStartBeatOffset of assigned notes if wanted
 * @example trackNotes("start", 4, 20, 0.5); // Notes between beats 4 and 20 will be given the track "start" and have an offest of 0.5
 */
function trackNotes (track:string, start:number, end:number, offset?:number) {
    notesBetween(start, end, note => {
        note.customData._track = track;
        if (offset) { note.customData._noteJumpStartBeatOffset = offset; };
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
 */
function trackNotesRB (trackR:string, trackB:string, start:number, end:number, offset?:number, njs?:number) {
    notesBetween(start, end, note => {
        if (note.type == 0) {
            note.customData._track = trackR;
        } else {
            note.customData._track = trackB;
        };
        if (offset) { note.customData._noteJumpStartBeatOffset = offset; };
        if (offset) { note.customData._noteJumpMovementSpeed = njs; };
    });
};

/**
 * @use **Duplicate notes to be used in other ways such as hitboxing**
 * @param start Start beat
 * @param end End Beat
 * @param newTrack Track given to fake notes
 * @param delay Time delay for the new notes to prevent weird gravity
 * @param fake If the notes will be _fake: true and _interactable: false
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