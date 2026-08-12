declare module "nodemailer-express-handlebars" {
    import { PluginFunction } from "nodemailer/lib/mailer";

    export interface ViewEngineOptions {
        extName: string;
        partialsDir?: string | string[];
        layoutsDir?: string;
        defaultLayout?: string;
        viewPath: string;
        viewEngine?: string | object;
    }

    export interface HandlebarsOptions {
        viewEngine: ViewEngineOptions;
        viewPath: string;
        extName: string;
    }

    function hbs(options: HandlebarsOptions): PluginFunction;
    export default hbs;
}
