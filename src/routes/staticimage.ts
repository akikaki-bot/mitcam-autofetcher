

import { Router, Response, Request } from "express";
import fs from "fs"
const app = Router()
import { cams } from "../../constants/cams"


app.get('/tonejo/:id', async (req: Request, res: Response) => {
    const id = req.params.id.toString()

    const finder = cams.find((v) => v === +id)
    if (typeof finder === "undefined") return res.status(404).json({ "status": "notfound" })
    try {
        const file = fs.readFileSync(`${__dirname}/../camfetcher/cache/tonejo.${id}.jpg`)
        return res.status(200).type("jpg").send(file)
    } catch (err) {
        return res.status(404)
    }
})

export default app;