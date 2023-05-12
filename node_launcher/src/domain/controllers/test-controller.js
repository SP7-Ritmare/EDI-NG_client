import express from "express";

export const TestRouter = express.Router()


TestRouter.get('/', (req, res) => {
  res.json({
    status: 200,
    message: 'ok'
  })
})
