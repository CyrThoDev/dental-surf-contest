// validation.ts
import { z } from "zod";

const phoneRegex = /^[0-9+\s().-]{8,20}$/;

export const registrationSchema = z.object({
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

  botField: z.string().max(0),
}).superRefine((data, ctx) => {
  if (data.competitionLicense && !data.clubMember) {
    ctx.addIssue({
      code: "custom",
      path: ["competitionLicense"],
      message:
        "La licence compétition n'est possible que si vous êtes adhérent(e) d'un club.",
    });
  }
});

export type RegistrationInput = z.infer<typeof registrationSchema>;