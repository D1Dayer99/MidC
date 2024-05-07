<template>
    <v-card>
        <v-card-title class="header">
            <h2>About</h2>
            <v-icon @click="onClose" class="piano-icon">mdi-close</v-icon>
        </v-card-title>
        
        <v-card-text>
            <div class="about-section">
            <h3>About MidC</h3>
            <p>
            MidC is a web app that visualizes the notes in a piano MIDI file, where each note of the piece will be represented as a "falling bar", where their length represents the lenght of the note. Users can either choose to visualize one of the pieces already provided by the server or upload their own MIDI file of their desired song. The web app provides many customization functions, such as adjusting the speed of the bars, changing the colours etc. to help its users learn their piano pieces fast and comfortbly. 
            </p>
            
            <div class="about-section">
            <h3>The team</h3>
            <p>
            Just an average IB student doing his stuff for his friend as part of the Internal Assessment for Computer Science.
            </p>
            </div>
            </div>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    props: ['onClose']
}
</script>


<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    background-color: var(--v-primary-base);
    color: var(--v-text-base);
}
.v-icon.v-icon {
    font-size: 1.5em;
}  
.piano-icon {
    color: var(--v-text-base) !important;
}
.piano-icon:hover {
    color:var(--v-accent-base) !important;
}
.about-section {
    padding: 1em 0;
}
.about-section:first-child {
    padding-top: 2em;
}
.about-section:last-child {
    padding-bottom: 0;
}
</style>
