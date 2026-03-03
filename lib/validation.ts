import { z } from "zod";

const phoneRegex = /^[0-9+\s().-]{8,20}$/;

export const registrationSchema = z
  .object({
    nom: z.string().trim().min(2).max(100),
    prenom: z.string().trim().min(2).max(100),
    telephone: z.string().trim().regex(phoneRegex, "Téléphone invalide").max(20),
    email: z.string().trim().email().max(254),

    // ✅ CHECKBOXES (true/false)
    clubMember: z.boolean(),
    competitionLicense: z.boolean(),

    // Niveau (tu peux garder en radio si 1 seul choix)
    niveau: z.enum(["debutant", "intermediaire", "expert"]),

    // Checkboxes (true/false)
    agreeDocs: z.boolean(), // "Fournir une copie ..."
    participateSurfLessons: z.boolean(),

    participateParty: z.boolean(), // "Participera à la soirée"
    accompanyCountParty: z.number().int().min(0).max(10).optional(),

    participateOnlyParty: z.boolean(), // "Participera uniquement à la soirée"
    accompanyCountOnlyParty: z.number().int().min(0).max(10).optional(),

    // Anti-bot honeypot
    botField: z.string().max(0),
  })
  .superRefine((data, ctx) => {
    // 1) docs obligatoires
    if (!data.agreeDocs) {
      ctx.addIssue({
        code: "custom",
        path: ["agreeDocs"],
        message:
          "Vous devez confirmer l’envoi de la pièce d’identité et du certificat médical.",
      });
      if ((data.participateParty || data.participateOnlyParty) && data.participateSurfLessons) {
  ctx.addIssue({
    code: "custom",
    path: ["participateSurfLessons"],
    message: "Les cours de surf ne sont pas compatibles avec la participation à la soirée.",
  });
}
    }

    // ✅ Licence compétition seulement si adhérent club
    if (data.competitionLicense && !data.clubMember) {
      ctx.addIssue({
        code: "custom",
        path: ["competitionLicense"],
        message: "La licence compétition n’est possible que si vous êtes adhérent(e) d’un club.",
      });
    }

    // 2) Soirée : options exclusives
    if (data.participateParty && data.participateOnlyParty) {
      ctx.addIssue({
        code: "custom",
        path: ["participateOnlyParty"],
        message:
          "Choisissez soit “Participera à la soirée” soit “Participera uniquement à la soirée”.",
      });
    }

    // 3) Si soirée cochée -> accompagnants requis
    if (data.participateParty && data.accompanyCountParty === undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["accompanyCountParty"],
        message: "Indiquez le nombre d’accompagnants (0 si aucun).",
      });
    }

    if (data.participateOnlyParty && data.accompanyCountOnlyParty === undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["accompanyCountOnlyParty"],
        message: "Indiquez le nombre d’accompagnants (0 si aucun).",
      });
    }
  });

export type RegistrationInput = z.infer<typeof registrationSchema>;