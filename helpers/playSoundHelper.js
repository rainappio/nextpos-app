import {Audio} from 'expo-av';



export const playSound = async () => {
    let count = 0
    console.log('Loading Sound');
    const {sound} = await Audio.Sound.createAsync(
        require('../assets/sounds/juntos607.mp3')
    )

    console.log('Playing Sound');

    await sound.playAsync();
    count++
    sound.setOnPlaybackStatusUpdate((playbackStatus) => {
        if (!playbackStatus.isLoaded) {
            // Update your UI for the unloaded state
            if (playbackStatus.error) {
                console.log(`Encountered a fatal error during playback: ${playbackStatus.error}`);
                // Send Expo team the error on Slack or the forums so we can help you debug!
            }
        } else {
            // Update your UI for the loaded state

            // if (playbackStatus.isPlaying) {
            //     console.log(`playbackStatus.isPlaying`);
            //     // Update your UI for the playing state
            // } else {
            //     console.log(`playbackStatus.isPlayingNOT`);
            //     // Update your UI for the paused state
            // }

            // if (playbackStatus.isBuffering) {
            //     console.log(`playbackStatus.isBuffering`);
            //     // Update your UI for the buffering state
            // }

            if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
                console.log(`playbackStatus.didJustFinish && !playbackStatus.isLooping`);
                //這裡決定重複幾次
                if (count >= 1) {
                    sound.unloadAsync()
                } else {
                    sound.replayAsync()
                    count++
                }

                // The player has just finished playing and will stop. Maybe you want to play something else?
            }

        }
    });
    console.log('Playing Sound End');
}

