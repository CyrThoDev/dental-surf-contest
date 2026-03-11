// import { Resend } from "resend"

// const resend = new Resend(process.env.RESEND_API_KEY!)

// export async function sendRegistrationEmail(data: any) {
//   await resend.emails.send({
//     from: "Dental Surf <no-reply@dentsurfcontest.com>",
//     to: process.env.CONTACT_EMAIL!,
//     subject: "Nouvelle pré-inscription",
//     html: `
//       <h2>Nouvelle inscription</h2>
//       <p><strong>Nom:</strong> ${data.nom}</p>
//       <p><strong>Prénom:</strong> ${data.prenom}</p>
//       <p><strong>Email:</strong> ${data.email}</p>
//       <p><strong>Téléphone:</strong> ${data.telephone}</p>
//       <p><strong>Niveau:</strong> ${data.niveau}</p>
//     `
//   })
// }

import type { RegistrationInput } from "@/lib/validation";

export async function sendRegistrationEmail(data: RegistrationInput) {
  // Version temporaire sans envoi mail
  console.log("Nouvelle inscription reçue :", data);

  // Simule un succès
  return { ok: true };
}