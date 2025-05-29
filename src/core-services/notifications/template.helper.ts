import * as handlebars from 'handlebars';
import * as fs from 'fs';

export class TemplateHelper {
  /**
   * Compile a Handlebars template with the provided context
   * @param templatePath Path to the template file
   * @param context Context object to use in the template
   * @returns  The compiled template as a string
   */
  static compileTemplate(templatePath: string, context: any): string {
    try {
      if (!fs.existsSync(templatePath)) {
        throw new Error(`Template file not found at path: ${templatePath}`);
      }

      const templateSource = fs.readFileSync(templatePath, 'utf8');

      const template = handlebars.compile(templateSource);

      return template(context);
    } catch (error) {
      throw new Error(`Error compiling template: ${error.message}`);
    }
  }
}
