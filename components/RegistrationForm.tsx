"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema, type RegistrationInput } from "@/lib/validation";

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1  text-red-400">{msg}</p>;
}

export default function RegistrationForm() {
  const defaultValues = useMemo<RegistrationInput>(
    () => ({
      nom: "",
      prenom: "",
      telephone: "",
      email: "",
      clubMember: false,
competitionLicense: false,
niveau:  "debutant", 
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
  const clubMember = watch("clubMember");

  // UX: si tu coches l’un, on décoche l’autre (cohérent avec la règle métier)
 const toggleParty = (checked: boolean) => {
  setValue("participateParty", checked, { shouldValidate: true });

  if (checked) {
    // ✅ nouveau : si soirée cochée => pas de cours de surf
    setValue("participateSurfLessons", false, { shouldValidate: true });

    // logique existante
    setValue("participateOnlyParty", false, { shouldValidate: true });
    setValue("accompanyCountOnlyParty", undefined, { shouldValidate: true });

    if (watch("accompanyCountParty") === undefined) {
      setValue("accompanyCountParty", 0);
    }
  } else {
    setValue("accompanyCountParty", undefined);
  }
};

 const toggleOnlyParty = (checked: boolean) => {
  setValue("participateOnlyParty", checked, { shouldValidate: true });

  if (checked) {
    // ✅ nouveau : si soirée cochée => pas de cours de surf
    setValue("participateSurfLessons", false, { shouldValidate: true });

    // logique existante
    setValue("participateParty", false, { shouldValidate: true });
    setValue("accompanyCountParty", undefined, { shouldValidate: true });

    if (watch("accompanyCountOnlyParty") === undefined) {
      setValue("accompanyCountOnlyParty", 0);
    }
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
    <section className="bg-red text-white ">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-center text-5xl font-agdasima ">PRÉ-INSCRIPTIONS</h2>

      <div className="text-center text-2xl leading-none font-agdasima">
        <p className="mt-2 text-center  text-white">
          La vague revient pour sa 3ᵉ édition ! 
          </p>
          <p>Préparez-vous à vivre des sensations fortes et à vibrer au rythme des vagues ! 
        </p>
        <p>La 3ᵉ édition du Dental Surf Contest arrive bientôt et promet encore plus d’adrénaline, de fun et de performances spectaculaires.</p> 
        <p>Que vous soyez surfeur confirmé ou simple passionné, venez encourager les meilleurs riders et profiter d’une ambiance unique entre passion et compétition. 
        Des surprises, des animations et des moments inoubliables vous attendent ! </p>
        
        <p>Inscrivez-vous dès maintenant et ne manquez pas le rendez-vous incontournable de la saison !</p>
        
        </div>

        <p className="mt-2 text-center text-xl font-semibold font-barlow-condensed ">
          Places compétiteurs/compétitrices limitées à 40 surfeurs! 
          Pas de limite pour les cours de surf
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl mx-auto mt-12">
          <h3 className="text-3xl font-bold  font-barlow-condensed text-yellow">INSCRIPTIONS</h3>

          {/* Inputs type "barres" */}
          <div className="mt-4 space-y-4 font-barlow">
            <div>
              <input
                {...register("nom")}
                placeholder="NOM"
                className="w-full border border-white/30 bg-white px-4 py-3  font-bold text-black outline-none placeholder:text-black"
              />
              <FieldError msg={errors.nom?.message} />
            </div>

            <div>
              <input
                {...register("prenom")}
                placeholder="PRENOM"
                className="w-full border border-white/30 bg-white px-4 py-3  font-bold text-black outline-none placeholder:text-black"
              />
              <FieldError msg={errors.prenom?.message} />
            </div>

            <div>
              <input
                {...register("telephone")}
                placeholder="TELEPHONE"
                className="w-full border border-white/30 bg-white px-4 py-3  font-bold text-black outline-none placeholder:text-black"
              />
              <FieldError msg={errors.telephone?.message} />
            </div>

            <div>
              <input
                {...register("email")}
                placeholder="EMAIL"
                className="w-full border border-white/30 bg-white px-4 py-3  font-bold text-black outline-none placeholder:text-black"
              />
              <FieldError msg={errors.email?.message} />
            </div>
          </div>

          {/* Radios oui/non */}
          <div className="mt-6 space-y-4  font-barlow">
        <div className="flex flex-wrap items-center gap-3">
  <label className="inline-flex items-center gap-2">
    <input type="checkbox" {...register("clubMember")} />
    <span className="text-white/90">Déjà adhérent d’un club</span>
  </label>
</div>

            <div className="flex flex-wrap items-center gap-3">
  <label className="inline-flex items-center gap-2">
    <input
      type="checkbox"
      {...register("competitionLicense")}
      disabled={!clubMember}
    />
    <span className="text-white/90">Licence compétition (si oui)</span>
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
          <div className="mt-6 space-y-4  text-white/90">
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
                    className="w-full border border-white/30 bg-white px-4 py-3  font-bold text-black outline-none disabled:opacity-50"
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
                    className="w-full border border-white/30 bg-white px-4 py-3  font-bold text-black outline-none disabled:opacity-50"
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
              className="font-barlow-condensed w-[300px] bg-blue px-8 py-3 text-2xl font-extrabold text-white disabled:opacity-60"
            >
              {isSubmitting ? "ENVOI..." : "VALIDER"}
            </button>
          </div>

          {isSubmitSuccessful && (
            <p className="mt-6 text-center  text-green-300">
              Merci ! Ta pré-inscription a bien été envoyée.
            </p>
          )}

          <div className="mt-5 mb-16 text-center">
            <p className="text-xl font-extrabold">MERCI A NOS PARTENAIRES</p>
            <button
              type="button"
              className="font-barlow-condensed mt-4 bg-dark-yellow px-10 py-2 text-xl font-extrabold text-white"
            >
              CONTACT
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}