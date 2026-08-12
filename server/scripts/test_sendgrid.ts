// import dotenv from "dotenv";
// dotenv.config();

// import { emailService } from "../config/mailer";

// async function run() {
//     const to =
//         process.env.TEST_SENDGRID_TO ||
//         process.env.User ||
//         "your-test-email@example.com";
//     console.log("Running SendGrid sandbox test to:", to);
//     try {
//         await emailService.sendTestEmail({
//             to,
//             subject: "SendGrid Sandbox Test",
//             text: "This is a sandbox test to check API auth (no email will be delivered).",
//             html: "<p>This is a sandbox test to check API auth (no email will be delivered).</p>",
//         });
//         console.log(
//             "sendTestEmail resolved without throwing — check logs for API response.",
//         );
//     } catch (err: any) {
//         console.error("sendTestEmail threw an error:");
//         // Print useful debug details
//         if (err && err.response) {
//             console.error(
//                 "Status code:",
//                 err.code || err.response.status || "unknown",
//             );
//             try {
//                 console.error(
//                     "Response body:",
//                     JSON.stringify(err.response.body),
//                 );
//             } catch (e) {
//                 console.error("Response body (raw):", err.response.body);
//             }
//         } else {
//             console.error(err);
//         }
//         process.exit(1);
//     }
// }

// run();
