import fs from "node:fs";
import express from "express";
import {Template} from "../model/template.js";
import {Config} from "../../config.js";

export const TemplateController = express.Router()

TemplateController.get('/', async (req, res) => {
  const templates = fs.readdirSync(Config.TEMPLATE_DIR)
  res.json(templates)
})
TemplateController.get('/:filename', async (req, res) => {
  const template = new Template()
  await template.load(`${Config.TEMPLATE_DIR}/${req.params.filename}`)
  res.json(template)
})
