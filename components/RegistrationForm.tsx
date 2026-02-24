"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema, type RegistrationInput } from "@/lib/validation";

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-red-400">{msg}</p>;
}

export default function RegistrationForm() {
  const defaultValues = useMemo<RegistrationInput>(
    () => ({
      nom: "",
      prenom: "",
      telephone: "",
      email: "",
      clubMember: "non",
      competitionLicense: "non",
      niveau: "debutant",
      agreeDocs: false,
      participateSurfLessons: false,
      participateParty: false,
      accompanyCountParty: undefined,
      participateOnlyParty: false,
      accompanyCountOnlyParty: undefined,
      botField: "",
    }),
    []
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const participateParty = watch("participateParty");
  const participateOnlyParty = watch("participateOnlyParty");

  // UX: si tu coches l’un, on décoche l’autre (cohérent avec la règle métier)
  const toggleParty = (checked: boolean) => {
    setValue("participateParty", checked, { shouldValidate: true });
    if (checked) {
      setValue("participateOnlyParty", false, { shouldValidate: true });
      setValue("accompanyCountOnlyParty", undefined, { shouldValidate: true });
      // met un 0 par défaut si tu veux un champ déjà rempli
      if (watch("accompanyCountParty") === undefined) setValue("accompanyCountParty", 0);
    } else {
      setValue("accompanyCountParty", undefined);
    }
  };

  const toggleOnlyParty = (checked: boolean) => {
    setValue("participateOnlyParty", checked, { shouldValidate: true });
    if (checked) {
      setValue("participateParty", false, { shouldValidate: true });
      setValue("accompanyCountParty", undefined, { shouldValidate: true });
      if (watch("accompanyCountOnlyParty") === undefined) setValue("accompanyCountOnlyParty", 0);
    } else {
      setValue("accompanyCountOnlyParty", undefined);
    }
  };

  const onSubmit = async (data: RegistrationInput) => {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      // Tu peux afficher un toast ici
      throw new Error("Erreur envoi");
    }
  };

  return (
    <section className="bg-black text-white">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="text-center text-4xl font-extrabold tracking-wide">PRÉ-INSCRIPTIONS</h2>

        <p className="mt-6 text-center text-sm leading-relaxed text-white/80">
          Rdv au SANTOCHA SURF CLUB à 7H30 - 3 rue de la savane, 40130 - Capbreton
          <br />
          Remise des prix, apéro tapas et soirée Rock&apos;n roll au BOARDRIDERS QUIKSILVER
          <br />
          36 Bd du Dr Junqua - 40130 Capbreton.
        </p>

        <p className="mt-4 text-center text-sm font-semibold text-orange-300">
          Places compétiteurs/compétitrices limitées à 40 surfeurs! <br />
          Pas de limite pour les cours de surf
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-12">
          <h3 className="text-lg font-extrabold tracking-wide text-yellow-400">INSCRIPTIONS</h3>

          {/* Inputs type "barres" */}
          <div className="mt-4 space-y-4">
            <div>
              <input
                {...register("nom")}
                placeholder="NOM"
                className="w-full border border-white/30 bg-white px-4 py-3 text-sm font-bold text-black outline-none"
              />
              <FieldError msg={errors.nom?.message} />
            </div>

            <div>
              <input
                {...register("prenom")}
                placeholder="PRENOM"
                className="w-full border border-white/30 bg-white px-4 py-3 text-sm font-bold text-black outline-none"
              />
              <FieldError msg={errors.prenom?.message} />
            </div>

            <div>
              <input
                {...register("telephone")}
                placeholder="TELEPHONE"
                className="w-full border border-white/30 bg-white px-4 py-3 text-sm font-bold text-black outline-none"
              />
              <FieldError msg={errors.telephone?.message} />
            </div>

            <div>
              <input
                {...register("email")}
                placeholder="EMAIL"
                className="w-full border border-white/30 bg-white px-4 py-3 text-sm font-bold text-black outline-none"
              />
              <FieldError msg={errors.email?.message} />
            </div>
          </div>

          {/* Radios oui/non */}
          <div className="mt-6 space-y-4 text-sm">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-white/90">Déjà adhérent d’un club</span>
              <label className="inline-flex items-center gap-2">
                <input type="radio" value="oui" {...register("clubMember")} />
                oui
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" value="non" {...register("clubMember")} />
                non
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-white/90">Si oui licence compétition</span>
              <label className="inline-flex items-center gap-2">
                <input type="radio" value="oui" {...register("competitionLicense")} />
                oui
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" value="non" {...register("competitionLicense")} />
                non
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-white/90">Niveau</span>
              <label className="inline-flex items-center gap-2">
                <input type="radio" value="debutant" {...register("niveau")} />
                Débutant
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" value="intermediaire" {...register("niveau")} />
                Intermédiaire
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" value="expert" {...register("niveau")} />
                Expert
              </label>
              <FieldError msg={errors.niveau?.message} />
            </div>
          </div>

          {/* Texte + checkboxes */}
          <div className="mt-6 space-y-4 text-sm text-white/90">
            <p className="font-semibold">Fournir une copie de pièce d’identité et un certificat médical</p>

            <label className="flex items-start gap-3">
              <input type="checkbox" {...register("agreeDocs")} className="mt-1" />
              <span>
                Fournir une copie de pièce d’identité et un certificat médical à envoyer à{" "}
                <span className="font-semibold">contact@dentalsurfcontest.com</span>
              </span>
            </label>
            <FieldError msg={errors.agreeDocs?.message} />

            <label className="flex items-center gap-3">
              <input type="checkbox" {...register("participateSurfLessons")} />
              <span>Participera aux cours de surf</span>
            </label>

            {/* Soirée + accompagnants (2 lignes) */}
            <div className="mt-4 space-y-4">
              <div className="grid gap-4 md:grid-cols-[1fr_280px] md:items-center">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={participateParty}
                    onChange={(e) => toggleParty(e.target.checked)}
                  />
                  <span>Participera à la soirée</span>
                </label>

                <div>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={10}
                    disabled={!participateParty}
                    {...register("accompanyCountParty", { valueAsNumber: true })}
                    placeholder="NOMBRE D’ACCOMPAGNANTS"
                    className="w-full border border-white/30 bg-white px-4 py-3 text-xs font-bold text-black outline-none disabled:opacity-50"
                  />
                  <FieldError msg={errors.accompanyCountParty?.message as string | undefined} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-[1fr_280px] md:items-center">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={participateOnlyParty}
                    onChange={(e) => toggleOnlyParty(e.target.checked)}
                  />
                  <span>Participera uniquement à la soirée</span>
                </label>

                <div>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={10}
                    disabled={!participateOnlyParty}
                    {...register("accompanyCountOnlyParty", { valueAsNumber: true })}
                    placeholder="NOMBRE D’ACCOMPAGNANTS"
                    className="w-full border border-white/30 bg-white px-4 py-3 text-xs font-bold text-black outline-none disabled:opacity-50"
                  />
                  <FieldError msg={errors.accompanyCountOnlyParty?.message as string | undefined} />
                </div>
              </div>

              <FieldError msg={errors.participateOnlyParty?.message as string | undefined} />
            </div>
          </div>

          {/* Honeypot */}
          <input
            {...register("botField")}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          {/* CTA */}
          <div className="mt-12 flex justify-center">
            <button
              disabled={isSubmitting}
              className="w-[260px] bg-teal-400 px-8 py-3 text-sm font-extrabold text-white disabled:opacity-60"
            >
              {isSubmitting ? "ENVOI..." : "VALIDER"}
            </button>
          </div>

          {isSubmitSuccessful && (
            <p className="mt-6 text-center text-sm text-green-300">
              Merci ! Ta pré-inscription a bien été envoyée.
            </p>
          )}

          <div className="mt-10 text-center">
            <p className="text-xl font-extrabold">MERCI A NOS PARTENAIRES</p>
            <button
              type="button"
              className="mt-4 bg-yellow-400 px-10 py-2 text-sm font-extrabold text-black"
            >
              CONTACT
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}