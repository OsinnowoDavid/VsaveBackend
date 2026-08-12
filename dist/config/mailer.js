"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_express_handlebars_1 = __importDefault(require("nodemailer-express-handlebars"));
// Load environment variables
dotenv_1.default.config();
class EmailService {
    constructor(config) {
        // Get environment variables with proper type conversion
        const smtpPort = parseInt(process.env.SMTP_PORT || "587");
        // Determine secure based on port (best practice)
        // Port 465 typically uses SSL/TLS, port 587 uses STARTTLS
        const isSecure = process.env.SMTP_SECURE !== undefined
            ? process.env.SMTP_SECURE === "true"
            : smtpPort === 465;
        const emailConfig = {
            host: config?.host || process.env.SMTP_HOST || "smtp.sendgrid.net",
            port: config?.port || smtpPort,
            secure: config?.secure !== undefined ? config.secure : isSecure,
            auth: {
                user: config?.auth?.user || process.env.SMTP_USER || "",
                pass: config?.auth?.pass || process.env.SMTP_PASSWORD || "",
            },
            from: config?.from ||
                process.env.FROM_EMAIL ||
                "noreply@yourdomain.com",
        };
        this.defaultFrom = emailConfig.from;
        // Validate required configuration
        if (!emailConfig.host ||
            !emailConfig.auth.user ||
            !emailConfig.auth.pass) {
            console.error("❌ SMTP configuration is incomplete:");
            console.error(`- Host: ${emailConfig.host ? "✅" : "❌"}`);
            console.error(`- User: ${emailConfig.auth.user ? "✅" : "❌"}`);
            console.error(`- Pass: ${emailConfig.auth.pass ? "✅" : "❌"}`);
            throw new Error("SMTP configuration missing. Check your .env file.");
        }
        // Log configuration (without sensitive data)
        console.log("📧 SMTP Configuration:");
        console.log(`- Host: ${emailConfig.host}`);
        console.log(`- Port: ${emailConfig.port}`);
        console.log(`- Secure: ${emailConfig.secure}`);
        console.log(`- Auth User: ${emailConfig.auth.user ? "✅ Set" : "❌ Missing"}`);
        console.log(`- From Email: ${emailConfig.from}`);
        // Create transporter
        this.transporter = nodemailer_1.default.createTransport({
            host: emailConfig.host,
            port: emailConfig.port,
            secure: emailConfig.secure,
            auth: emailConfig.auth,
            // Add additional options for better reliability
            pool: true, // Use pooled connections
            maxConnections: 5,
            maxMessages: 100,
            rateDelta: 1000,
            rateLimit: 10,
            // Add TLS options
            tls: {
                // Only reject unauthorized in production
                rejectUnauthorized: process.env.NODE_ENV === "production",
            },
            // Timeout settings
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 15000,
        });
        // Attach handlebars plugin after transporter creation
        this.transporter.use("compile", (0, nodemailer_express_handlebars_1.default)({
            viewEngine: {
                extName: ".hbs",
                viewPath: "./views/",
                viewEngine: "express-handlebars",
            },
            viewPath: "./views/",
            extName: ".hbs",
        }));
        // Verify connection configuration
        this.verifyConnection();
    }
    /**
     * Verify the SMTP connection
     */
    async verifyConnection() {
        try {
            await this.transporter.verify();
            console.log("✅ SMTP connection verified successfully");
        }
        catch (error) {
            console.error("❌ SMTP connection verification failed:", error);
            // Provide helpful error messages
            if (error instanceof Error) {
                if (error.message.includes("wrong version number")) {
                    console.error("\n🔑 SSL/TLS Version Mismatch Fix:");
                    console.error("Try one of these configurations:");
                    console.error("\nOption 1 (STARTTLS):");
                    console.error("SMTP_PORT=587");
                    console.error("SMTP_SECURE=false");
                    console.error("\nOption 2 (SSL/TLS):");
                    console.error("SMTP_PORT=465");
                    console.error("SMTP_SECURE=true");
                }
                else if (error.message.includes("Authentication")) {
                    console.error("\n🔑 Authentication failed. Check:");
                    console.error("1. SMTP_USER is correct");
                    console.error("2. SMTP_PASSWORD is correct");
                    console.error("3. Your API key/SMTP credentials are active");
                }
                else if (error.message.includes("ECONNREFUSED")) {
                    console.error("\n🔑 Connection refused. Check:");
                    console.error("1. SMTP_HOST is correct");
                    console.error("2. SMTP_PORT is correct");
                    console.error("3. Your firewall allows outbound SMTP connections");
                }
            }
            throw error;
        }
    }
    /**
     * Send an email
     */
    async sendEmail(options) {
        try {
            console.log(`📤 Sending email to: ${options.to}`);
            const mailOptions = {
                from: options.from || this.defaultFrom,
                to: options.to,
                subject: options.subject,
                text: options.text,
                html: options.html,
                cc: options.cc,
                bcc: options.bcc,
                attachments: options.attachments,
                replyTo: options.replyTo,
                headers: {
                    "X-Application": "VSave",
                    "X-Priority": "1",
                },
            };
            const info = await this.transporter.sendMail(mailOptions);
            console.log(`✅ Email sent successfully to ${options.to}`);
            console.log(`📬 Message ID: ${info.messageId}`);
            return info;
        }
        catch (error) {
            console.error("❌ Error sending email:", error);
            throw error;
        }
    }
    /**
     * Send email using a template
     */
    async sendTemplateEmail(to, subject, templateData, options) {
        return this.sendEmail({
            to,
            subject,
            html: templateData.html,
            text: templateData.text || templateData.html.replace(/<[^>]*>/g, ""),
            ...options,
        });
    }
    /**
     * Send batch emails
     */
    async sendBatchEmails(emails, from) {
        const results = [];
        for (const email of emails) {
            try {
                const result = await this.sendEmail({
                    to: email.to,
                    subject: email.subject,
                    html: email.html,
                    text: email.text,
                    from,
                });
                results.push(result);
            }
            catch (error) {
                console.error(`❌ Failed to send email to ${email.to}:`, error);
                // Continue with other emails
            }
        }
        return results;
    }
    /**
     * Send email with attachment
     */
    async sendEmailWithAttachment(to, subject, html, attachments, options) {
        return this.sendEmail({
            to,
            subject,
            html,
            attachments,
            ...options,
        });
    }
    /**
     * Close the transporter connection
     */
    async close() {
        try {
            await this.transporter.close();
            console.log("✅ SMTP connection closed");
        }
        catch (error) {
            console.error("❌ Error closing SMTP connection:", error);
        }
    }
}
exports.EmailService = EmailService;
// Export a singleton instance
exports.emailService = new EmailService();
