import { z } from "zod";

const phoneRegex = /^[0-9+\s().-]{8,20}$/;

export const registrationSchema = z
  .object({
    nom: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères.").max(100),
    prenom: z.string().trim().min(2, "Le prénom doit contenir au moins 2 caractères.").max(100),
    telephone: z
      .string()
      .trim()
      .max(20)
      .regex(phoneRegex, "Téléphone invalide"),
    email: z.string().trim().email("Email invalide").max(254),

    clubMember: z.boolean(),
    competitionLicense: z.boolean(),

    niveau: z.enum(["debutant", "intermediaire", "expert"], {
      message: "Veuillez choisir un niveau.",
    }),

    participateSurfLessons: z.boolean(),

    participateParty: z.boolean(),
    accompanyCountParty: z.number().int().min(0).max(10).optional(),

    participateOnlyParty: z.boolean(),
    accompanyCountOnlyParty: z.number().int().min(0).max(10).optional(),

    botField: z.string().max(0),
  })
  .superRefine((data, ctx) => {
    // 1) Licence compétition seulement si adhérent club
    if (data.competitionLicense && !data.clubMember) {
      ctx.addIssue({
        code: "custom",
        path: ["competitionLicense"],
        message:
          "La licence compétition n’est possible que si vous êtes adhérent(e) d’un club.",
      });
    }

    // 2) Soirée classique et soirée seule : exclusives
    if (data.participateParty && data.participateOnlyParty) {
      ctx.addIssue({
        code: "custom",
        path: ["participateOnlyParty"],
        message:
          "Choisissez soit « Participera à la soirée » soit « Participera uniquement à la soirée ».",
      });
    }

    // 3) Si soirée classique cochée, les cours de surf doivent aussi être cochés
    if (data.participateParty && !data.participateSurfLessons) {
      ctx.addIssue({
        code: "custom",
        path: ["participateParty"],
        message:
          "Merci de cocher « Participera aux cours de surf » ou de choisir l’option « Participera uniquement à la soirée » si vous ne participez pas aux cours de surf.",
      });
    }

    // 4) "Uniquement à la soirée" incompatible avec les cours de surf
    if (data.participateOnlyParty && data.participateSurfLessons) {
      ctx.addIssue({
        code: "custom",
        path: ["participateOnlyParty"],
        message:
          "L’option « Participera uniquement à la soirée » n’est pas compatible avec les cours de surf.",
      });
    }

    // 5) Si soirée classique cochée -> nombre d'accompagnants requis
    if (data.participateParty && data.accompanyCountParty === undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["accompanyCountParty"],
        message: "Indiquez le nombre d’accompagnants (0 si aucun).",
      });
    }

    // 6) Si soirée seule cochée -> nombre d'accompagnants requis
    if (data.participateOnlyParty && data.accompanyCountOnlyParty === undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["accompanyCountOnlyParty"],
        message: "Indiquez le nombre d’accompagnants (0 si aucun).",
      });
    }
  });

export type RegistrationInput = z.infer<typeof registrationSchema>;