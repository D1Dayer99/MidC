import { playlistState, toneState } from "@/store/consts/states.js";
import { SET_RECORDER, 
    SET_IS_RECORDING,
    SET_START_RECORD_TIME,
    SET_END_RECORD_TIME,
    SET_SAVE_RECORDING_DIALOG,
    ADD_RECORD_MIDI,
    ADD_RECORD_AUDIO,
    ADD_RECORD_MAP,
    CLEAR_RECORD_MIDI,
    CLEAR_RECORD_AUDIO,
    CALCULATE_DURATION_AND_TIME_MIDI,
    ADD_NEW_RECORDED_SONG
} from "@/store/consts/mutation_types.js";
import { createRecorder, 
    recordMidiNote,
    startRecording,
    stopRecording,
    saveSong,
    connectSampler
} from "@/store/consts/actions.js";

export default {
    namespaced: true,

    state: {
    recorder: {},
    recordedAudioChunks: [],
    recordingHelperMap: {},
    recordedMidiChunks: [],
    startRecordTime: 0,
    endRecordTime: 0,
    isRecording: false,
    saveRecordingDialog: false,
    },

    mutations: {
        [SET_RECORDER](state, val){
            state.recorder = val;
        },
        [SET_IS_RECORDING](state, val){
            state.isRecording = val;
        },
        [SET_START_RECORD_TIME](state, val){
            state.startRecordTime = val;
        },
        [SET_END_RECORD_TIME](state, val){
            state.endRecordTime = val;
        },
        [SET_SAVE_RECORDING_DIALOG](state, val){
            state.saveRecordingDialog = val;
        },
        [ADD_RECORD_MIDI](state, note){
            if(state.recordingHelperMap[note] != undefined) {
                state.recordedMidiChunks.push({
                    name : state.recordingHelperMap[note].name,
                    startTime : state.recordingHelperMap[note].startTime,
                    endTime : new Date().getTime()
                });

                delete state.recordingHelperMap[note];
            }
        },
        [ADD_RECORD_AUDIO](state, val){
            state.recordedAudioChunks.push(val);
        },
        [ADD_RECORD_MAP](state, note){
            state.recordingHelperMap[note] = {
                name: note,
                startTime : new Date().getTime(),
                endTime : null
            };
        },
        [CLEAR_RECORD_MIDI](state){
            state.recordedMidiChunks.length = 0;
        },
        [CLEAR_RECORD_AUDIO](state){
            state.recordedAudioChunks.length = 0;
        },
        [CALCULATE_DURATION_AND_TIME_MIDI](state){
            if(state.recordedMidiChunks.length != 0){
            
                state.recordedMidiChunks[0].time = state.recordedMidiChunks[0].startTime - state.startRecordTime;
                state.recordedMidiChunks[0].duration = state.recordedMidiChunks[0].endTime - state.recordedMidiChunks[0].startTime;
    
                for(let i = 1; i < state.recordedMidiChunks.length; i++){
                    state.recordedMidiChunks[i].time = state.recordedMidiChunks[i - 1].time + 
                                                        state.recordedMidiChunks[i].startTime - 
                                                        state.recordedMidiChunks[i - 1].startTime
                    state.recordedMidiChunks[i].duration = state.recordedMidiChunks[i].endTime - state.recordedMidiChunks[i].startTime;
                }

                for(let i = 0; i < state.recordedMidiChunks.length; i++){
                    state.recordedMidiChunks[i].time /= 1000;
                    state.recordedMidiChunks[i].duration /= 1000;
                }
            }
        },
    },

    actions: {
        [createRecorder]({ rootState, commit, dispatch }){
            const dest  = rootState.toneState.tone.context.createMediaStreamDestination();
            commit(SET_RECORDER, new MediaRecorder(dest.stream));
            dispatch(toneState + "/" + connectSampler, dest, {root:true});
        },

        [recordMidiNote]({ commit }, note) {
            commit(ADD_RECORD_MAP, note);
        },

        [startRecording]({ commit, state }){
            commit(CLEAR_RECORD_MIDI);
            commit(CLEAR_RECORD_AUDIO);

            state.recorder.start();
            state.recorder.ondataavailable = e => state.recordedAudioChunks.push(e.data);

            commit(SET_IS_RECORDING, true);
            commit(SET_START_RECORD_TIME, new Date().getTime());
        },

        [stopRecording]({ commit, state }){
            state.recorder.stop();
            state.recorder.onstop = e => {
                let blob = new Blob(state.recordedAudioChunks, { type: 'audio/ogg; codecs=opus' });
                document.querySelector('audio').src = URL.createObjectURL(blob);
            };

            commit(SET_IS_RECORDING, false);
            commit(SET_END_RECORD_TIME, new Date().getTime());
            commit(CALCULATE_DURATION_AND_TIME_MIDI);
            commit(SET_SAVE_RECORDING_DIALOG, true);
            commit(playlistState + "/" + "SET_CURRENT_SONG", "", {root:true});
        },

        [saveSong]({state, commit}, songName){
            const newSong = {
                name : songName,
                notes : Array.from(state.recordedMidiChunks),
                forPlaylist: false
            };
    
            commit(playlistState + "/" + ADD_NEW_RECORDED_SONG, newSong, {root:true});
            commit(SET_SAVE_RECORDING_DIALOG, false);
        }
    }
}
