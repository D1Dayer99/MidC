import { CanvasMessages } from "../../utils/CanvasMessages"
import { PlayingState } from "../../utils/PlayingState"
import { SET_WORKER, SET_CANVAS_WATERFALL_DELAY } from "@/store/consts/mutation_types.js"
import { initCanvas, resizeCanvas, startDrawNote, stopDrawNote, pauseOrResumeSong, stopSong, changeNoteColors } from "@/store/consts/actions.js"

export default {
    namespaced: true,

    state: {
    worker: {}, // where offscreencanvas is drawn
    waterfallDelay: 0,
    },

    mutations: {
        [SET_WORKER](state, worker){
            state.worker = worker;
        },
        [SET_CANVAS_WATERFALL_DELAY](state, delay){
            state.waterfallDelay = delay;
        },
    },

    actions: {
        [initCanvas]({ commit, state }, { offscreenCanvas, visualizer_file }){
            commit(SET_WORKER, new Worker(visualizer_file));
            state.worker.postMessage({ canvas: offscreenCanvas, messageType : CanvasMessages.INIT}, [offscreenCanvas]);
        },

        [resizeCanvas]({ commit, state }, { height, width, array, whiteWidth, blackWidth, waterfallDelay }){

            let canvasDataIndexesByNote = {}
            for(let index = 0; index < array.length; index++){
                const key = array[index].getAttribute("data-note");
                const value = Math.floor(array[index].getBoundingClientRect().x);
                canvasDataIndexesByNote[key] = value;
            }

            commit(SET_CANVAS_WATERFALL_DELAY, waterfallDelay);

            state.worker.postMessage({ 
                messageType : CanvasMessages.RESIZE, 
                resizeData : {
                    height: Math.floor(height), 
                    width: Math.floor(width), 
                    whiteWidth : Math.floor(whiteWidth), 
                    blackWidth: Math.floor(blackWidth), 
                    array : canvasDataIndexesByNote 
                }
            });
        },

        [startDrawNote]({state}, drawNote){
            state.worker.postMessage({ messageType : CanvasMessages.START_DRAW_NOTE, drawNote });
        },

        [stopDrawNote]({state}, drawNote){
            state.worker.postMessage({ messageType : CanvasMessages.STOP_DRAW_NOTE, drawNote });
        },

        [pauseOrResumeSong]({state}, playing){
            state.worker.postMessage({ messageType : CanvasMessages.PAUSE_SONG, playing });
        },

        [stopSong]({state}){
            state.worker.postMessage({ messageType : CanvasMessages.STOP_SONG, playing : PlayingState.STOP });
        },

        [changeNoteColors]({state}, { blackNoteColor, whiteNoteColor }){
            state.worker.postMessage({ messageType : CanvasMessages.CHANGE_COLOR, colors : { blackNoteColor, whiteNoteColor }});
        }
    }
}
