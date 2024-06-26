import { Midi } from "@tonejs/midi"
import Timer  from "../../utils/SetTimeoutTimer"
import { canvasState, keyboardState, menuState } from "@/store/consts/states.js";
import { SET_CURRENT_SONG, 
    SET_CURRENT_SONG_DURATION,
    SET_IS_LOADING,
    ADD_NEW_RECORDED_SONG,
    ADD_TIMER,
    CLEAR_TIMERS,
    SET_NOTE_PRESSED,
    CLEAR_PRESSED_KEYS
} from "@/store/consts/mutation_types.js";
import { changeSong, 
    clearTimes,
    pauseTimers,
    resumeTimers,
    prepareNotes,
    prepareSong,
    stopPlaying,
    startDrawNote,
    stopDrawNote,
} from "@/store/consts/actions.js";
import { ADD_SONG } from "../consts/mutation_types";

const SONGS_URL = "./songs/";

export default {
    namespaced: true,

    state: {
    songs:[
        {name : "Rick Astley - Never Gonna Give You Up", fromPlaylist: true },
        { name: "J. Pachelbel - Canon in D", fromPlaylist: true },
        { name: "twinkle-twinkle-little-star", fromPlaylist:true}
        ],
    currentSong: "",
    timers : [],
    currentSongDuration: 0,
    isLoading: false,
    uploadMidi: null,
    },

    mutations: {
    [SET_CURRENT_SONG](state, val){
        state.currentSong = val;
    },
    [SET_CURRENT_SONG_DURATION](state, val){
        state.currentSongDuration = val;
    },
    [SET_IS_LOADING](state, val){
        state.isLoading = val;
    },
    [ADD_NEW_RECORDED_SONG](state, val){
        state.songs.unshift(val);
    },
    [ADD_TIMER](state, timer){
        state.timers.push(timer);
    },
    [CLEAR_TIMERS](state){
        state.timers.length = 0;
    },
    [ADD_SONG](state,song) {
        state.songs.push(song)
    }
    },

    actions: {
        [changeSong]({commit, dispatch}, currentSong) {
            commit(SET_CURRENT_SONG, currentSong);
            if(currentSong != ""){
                dispatch(prepareSong);
            }
        },
        [clearTimes]({state, commit}){
            state.timers.forEach(timer => timer.pause());
            commit(CLEAR_TIMERS);
        },

        [pauseTimers]({state}){
            state.timers.forEach(timer => timer.pause());
        },

        [resumeTimers]({state}){
            state.timers.forEach(timer => timer.resume());
        },

        [prepareNotes]({state, rootState, commit, dispatch}, {notes, lastSong}) {
            notes.forEach((note, i) => {
                if(lastSong && i === notes.length - 1){
                    commit(SET_CURRENT_SONG_DURATION, note.time + note.duration);
                }
                
                rootState.toneState.tone.Transport.schedule(() => {
                    commit(ADD_TIMER, new Timer(() => {
                        
                        if(state.currentSong.fromPlaylist){
                            rootState.toneState.sampler.triggerAttackRelease(note.name, note.duration, rootState.toneState.tone.now(), note.velocity);
                        } else {
                            rootState.toneState.sampler.triggerAttack(note.name);
                        }

                    }, rootState.canvasState.waterfallDelay));
            
                }, note.time)
    
                let index = null;
                let forBlackNote = false;
                for (let i = 0; i < rootState.keyboardState.notes.length; i++) {
                    if(rootState.keyboardState.notes[i].note === note.name){
                    index = i;
                    break;
                    } 
                    else if(rootState.keyboardState.notes[i].blackNote && rootState.keyboardState.notes[i].blackNote.note === note.name){
                    index = i;
                    forBlackNote = true;
                    break;
                    }
                }
    
                rootState.toneState.tone.Transport.schedule(time => {
                        if(index != null){
                            commit(ADD_TIMER, new Timer(() => {
                                commit(keyboardState + "/" + SET_NOTE_PRESSED, {index, forBlackNote, pressed : true}, {root:true});
                            }, rootState.canvasState.waterfallDelay));
                            
                            dispatch(canvasState + "/" + startDrawNote, {noteName : note.name, forBlackNote}, {root:true});
                        }
                }, note.time)
    
                rootState.toneState.tone.Transport.schedule(time => {
                        if(index != null){
                            commit(ADD_TIMER, new Timer(() => {

                                commit(keyboardState + "/" + SET_NOTE_PRESSED, {index, forBlackNote, pressed : false}, {root:true});
                                rootState.toneState.sampler.triggerRelease(note.name);

                                if(lastSong && i === notes.length - 1){
                                    dispatch(stopPlaying, "");
                                }

                            }, rootState.canvasState.waterfallDelay));

                            dispatch(canvasState + "/" + stopDrawNote, {noteName : note.name, forBlackNote}, {root:true});
                        }
                }, note.time + note.duration)
    
            })
        },

        [prepareSong]({state, dispatch}){
            if(state.currentSong.fromPlaylist){
                Midi.fromUrl(SONGS_URL + state.currentSong.name + ".mid").then(midi => {
                    midi.tracks.forEach((track, i) => dispatch(prepareNotes, {notes : track.notes, lastSong : midi.tracks.length == i + 1}));
                });  
            } else {
                dispatch(prepareNotes, {notes:state.currentSong.notes, lastSong : true})
            }
        },

        [stopPlaying]({dispatch, rootState, commit}, currentSong){
            commit(SET_IS_LOADING, true);
            dispatch(clearTimes);
            commit(keyboardState + "/" + CLEAR_PRESSED_KEYS, {}, {root:true});
            dispatch(menuState + "/" + stopPlaying, {}, {root:true});
            
            setTimeout(() => {
                rootState.toneState.tone.Transport.stop();
                rootState.toneState.tone.Transport.cancel();
                dispatch(changeSong, currentSong);
                commit(SET_IS_LOADING, false);
            }, 10)
        }
    }
}
