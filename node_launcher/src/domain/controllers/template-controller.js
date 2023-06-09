import express from "express";
import {Template} from "../model/template.js";

export const TemplateController = express.Router()

TemplateController.get('/:filename', async (req, res) => {
  const template = new Template()
  await template.load(`src/templates/${req.params.filename}`)
  res.json(template)
})
