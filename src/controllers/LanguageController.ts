import asyncHandler from 'express-async-handler'
import { Request, Response } from 'express'
import i18n from '../../config/i18n';
import { body, validationResult } from 'express-validator'
import AppError from '../types/AppError';

class LanguageController {
  setLanguage = [
    body('language').isString().notEmpty().custom((value) => ['en', 'es'].includes(value)).withMessage(i18n.__('errors.invalidLanguage')),
    asyncHandler(async (req: Request, res: Response) => {
      const { language } = req.body;

      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw new AppError(errors.array().join(', '), 400)
      }
      
      try {
        i18n.setLocale(language);
        console.log("set language ", language)
        res.status(200).send()
      } catch (error) {
        res.status(400).send()
      }
    })
  ]
}

const languageController = new LanguageController()
export { languageController }