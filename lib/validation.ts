import { z } from "zod";

const phoneRegex = /^[0-9+\s().-]{8,20}$/;

export const registrationSchema = z
  .object({
    nom: z.string().trim().min(2).max(100),
    prenom: z.string().trim().min(2).max(100),
    telephone: z.string().trim().regex(phoneRegex, "Téléphone invalide").max(20),
    email: z.string().trim().email().max(254),

    // Radios oui/non
    clubMember: z.enum(["oui", "non"]),
    competitionLicense: z.enum(["oui", "non"]),

    // Niveau
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
    // 1) docs obligatoires (selon ton texte c'est requis)
    if (!data.agreeDocs) {
      ctx.addIssue({
        code: "custom",
        path: ["agreeDocs"],
        message: "Vous devez confirmer l’envoi de la pièce d’identité et du certificat médical.",
      });
    }

    // 2) Soirée : options exclusives (vu la maquette)
    if (data.participateParty && data.participateOnlyParty) {
      ctx.addIssue({
        code: "custom",
        path: ["participateOnlyParty"],
        message: "Choisissez soit “Participera à la soirée” soit “Participera uniquement à la soirée”.",
      });
    }

    // 3) Si soirée cochée -> accompagnants requis (champ visible à droite)
    if (data.participateParty) {
      if (data.accompanyCountParty === undefined) {
        ctx.addIssue({
          code: "custom",
          path: ["accompanyCountParty"],
          message: "Indiquez le nombre d’accompagnants (0 si aucun).",
        });
      }
    }

    if (data.participateOnlyParty) {
      if (data.accompanyCountOnlyParty === undefined) {
        ctx.addIssue({
          code: "custom",
          path: ["accompanyCountOnlyParty"],
          message: "Indiquez le nombre d’accompagnants (0 si aucun).",
        });
      }
    }
  });

export type RegistrationInput = z.infer<typeof registrationSchema>;