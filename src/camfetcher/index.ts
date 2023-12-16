
import * as cron from "node-cron"
import fs from "fs"

export class CamFetcher {


    public readonly place : string
    public readonly camId : number[]

    public intervalProcess : NodeJS.Timeout

    private JobEnd : boolean

    constructor( place : string , camIds : number[] ){
        this.camId = camIds
        this.place = place
        this.intervalProcess = setTimeout(() => {})
        this.JobEnd = true
    }

    /**
     * The cron job start.
     * 
     * fetch the image about 10 min.
     */
    public job() {
        console.log(`[CamFetcher] \u001b[32m✔\u001b[37m CamId${this.camId.join(',')}のJobは正常に開始されました。`)
        this.fetchPicture()
        this.intervalProcess = setInterval(async () => {
            console.log( "Is job ended : "+this.JobEnd )
            new Date().getMinutes() % 10 === 0 ? ( !this.JobEnd && await this.fetchPicture()) : this.JobEnd = false;
        }, 1010 * 10)
    }

    public async fetchPicture() {
        this.camId.map( async (id) => {
            const response = await fetch(`https://www.ktr.mlit.go.jp/${this.place}/cctv/cameraimage/cam${id}_640.jpg`)
            if(!response.ok) throw new Error(`CameraHTTPError : Fetch failed. ${response.status} ${response.statusText} - ${response.url}`)
            const ImageBuff = await response.arrayBuffer()
            this.savePicture(ImageBuff, id)
            return Buffer.from(ImageBuff)
        })
        this.JobEnd = true;
        console.log(`[CamFetcher] \u001b[32m✔\u001b[37m 十分おきの画像取得に成功しました。 合計枚数 : ${this.camId.length}`)
    }

    private savePicture( imageBuff : ArrayBuffer , id : number) {
        const Image = Buffer.from(imageBuff)

        const stream = fs.createWriteStream(`${__dirname}/cache/${this.place}.${id}.jpg`)
        stream.write(Image, "binary")
        stream.end()
        stream.on('finish', async () => {
           // await this.saveLabelDatabase(`${this.place}.${id}.jpg`)
        })
    }

    /*
    private async saveLabelDatabase( label : string ) {
        const data = await db.get(`${this.place}.cams`)
        if(typeof data == "undefined") await db.set(`${this.place}.cams`, [label].join(','))
        else await db.set(`${this.place}.cams`, [...data.split(','),label].join(','))
    }
    */
}