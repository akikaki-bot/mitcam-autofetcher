
import express from "express"
import { cams } from "../constants/cams"


const app = express()

app.listen(8080, () => {
    new CamFetcher("tonejo", cams).job()
    console.log('[CamBackend] Listening at port : 8080')
})

import { CamFetcher } from "./camfetcher"


import staticImage from "./routes/staticimage"
app.use("/static", staticImage)