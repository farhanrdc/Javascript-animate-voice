class Microphone {
    constructor() {
        this.initialized = false;
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function (stream) {
                this.audioContext = new AudioContext();
                this.microphone = this.audioContext.createMediaStreamSource(stream); //Convert into audio nodes
                this.analyser = this.audioContext.createAnalyser(); //Memvisualisasikan audio time dan frequency data
                this.analyser.fftSize = 512; //slice audio data into equal number of sample such as 32,64,128 ect
                const bufferLength = this.analyser.frequencyBinCount; //Membuat angka data audio menjadi setengah dari fftSize
                this.dataArray = new Uint8Array(bufferLength); // membuat setiap sample data audio menjadi angka antara 0 - 255
                this.microphone.connect(this.analyser); //menyambungkan setiap audio node
                this.initialized = true;
            }.bind(this)).catch(function (err) {
                alert(err);
            });
    }
    getSamples() {
        this.analyser.getByteTimeDomainData(this.dataArray); // copy current waveForm/time domain data kedalam bentuk array
        let normSamples = [...this.dataArray].map(e => e / 128 - 1); // Mengubah array Uint8Array menjadi bentuk array biasa,
        //Dan juga mengubah angka array dari 0 - 255 menjadi -1 dan 1
        return normSamples;
    }
    //getVolume ini dibuat untuk memberikan satu value yang merepresentasikan over all curent value yang berasal dari microphone
    getVolume() {
        this.analyser.getByteTimeDomainData(this.dataArray);
        let normSamples = [...this.dataArray].map(e => e / 128 - 1);
        let sum = 0;
        for (let i = 0; i < normSamples.length; i++) {
            sum += normSamples[i] * normSamples[i];
        }
        let volume = Math.sqrt(sum / normSamples);
        return volume;
    }

}
