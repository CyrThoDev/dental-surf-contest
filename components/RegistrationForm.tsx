"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema, type RegistrationInput } from "@/lib/validation";

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-black">{msg}</p>;
}

export default function RegistrationForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const defaultValues = useMemo<RegistrationInput>(
    () => ({
      nom: "",
      prenom: "",
      telephone: "",
      email: "",
      clubMember: false,
      competitionLicense: false,
      niveau: "debutant",
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

  const CB = "h-6 w-6  shrink-0 accent-black";

  useEffect(() => {
    if (!clubMember) {
      setValue("competitionLicense", false, { shouldValidate: true });
    }
  }, [clubMember, setValue]);

  const toggleParty = (checked: boolean) => {
    setValue("participateParty", checked, { shouldValidate: true });

    if (checked) {
      setValue("participateOnlyParty", false, { shouldValidate: true });
      setValue("accompanyCountOnlyParty", undefined, { shouldValidate: true });

      if (watch("accompanyCountParty") === undefined) {
        setValue("accompanyCountParty", 0, { shouldValidate: true });
      }
    } else {
      setValue("accompanyCountParty", undefined, { shouldValidate: true });
    }
  };

  const toggleOnlyParty = (checked: boolean) => {
    setValue("participateOnlyParty", checked, { shouldValidate: true });

    if (checked) {
      setValue("participateSurfLessons", false, { shouldValidate: true });
      setValue("participateParty", false, { shouldValidate: true });
      setValue("accompanyCountParty", undefined, { shouldValidate: true });

      if (watch("accompanyCountOnlyParty") === undefined) {
        setValue("accompanyCountOnlyParty", 0, { shouldValidate: true });
      }
    } else {
      setValue("accompanyCountOnlyParty", undefined, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: RegistrationInput) => {
    setSubmitError(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.error || "Erreur envoi");
      }
    } catch (error) {
      console.error("Erreur soumission formulaire :", error);
      setSubmitError("Une erreur est survenue lors de l’envoi du formulaire.");
    }
  };

  return (
    <section className="bg-red text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-center text-5xl font-agdasima">INSCRIPTIONS</h2>

        <div className="text-center text-2xl leading-none font-agdasima">
          <p className="mt-2 text-center text-white">
            La vague revient pour sa 3ᵉ édition ! Rendez-vous le 4 septembre sur
            la plage de CAPBRETON AU CLUB SURF OLDIES - Promenade du front de mer
            Plage du Prévent
          </p>
          <p>
            Préparez-vous à vivre des sensations fortes et à vibrer au rythme des
            vagues !
          </p>
          <p>
            La 3ᵉ édition du Dental Surf Contest arrive bientôt et promet encore
            plus d’adrénaline, de fun et de performances spectaculaires.
          </p>
          <p>
            Que vous soyez surfeur confirmé ou simple passionné, venez encourager
            les meilleurs riders et profiter d’une ambiance unique entre passion
            et compétition. Des surprises, des animations et des moments
            inoubliables vous attendent !
          </p>
          <p>
            Inscrivez-vous dès maintenant et ne manquez pas le rendez-vous
            incontournable de la saison !
          </p>
        </div>

        <p className="mt-2 text-center text-xl font-semibold font-barlow-condensed">
          Places compétiteurs/compétitrices limitées à 40 surfeurs ! Pas de
          limite pour les cours de surf
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto mt-12 max-w-2xl"
        >
          <h3 className="font-barlow-condensed text-3xl font-bold text-yellow">
            INSCRIPTIONS
          </h3>

          <div className="mt-4 space-y-4 font-barlow">
            <div>
              <input
                {...register("nom")}
                placeholder="NOM"
                className="w-full border border-white/30 bg-white px-4 py-3 font-bold text-black outline-none placeholder:text-black"
              />
              <FieldError msg={errors.nom?.message} />
            </div>

            <div>
              <input
                {...register("prenom")}
                placeholder="PRENOM"
                className="w-full border border-white/30 bg-white px-4 py-3 font-bold text-black outline-none placeholder:text-black"
              />
              <FieldError msg={errors.prenom?.message} />
            </div>

            <div>
              <input
                {...register("telephone")}
                placeholder="TELEPHONE"
                className="w-full border border-white/30 bg-white px-4 py-3 font-bold text-black outline-none placeholder:text-black"
              />
              <FieldError msg={errors.telephone?.message} />
            </div>

            <div>
              <input
                {...register("email")}
                placeholder="EMAIL"
                className="w-full border border-white/30 bg-white px-4 py-3 font-bold text-black outline-none placeholder:text-black"
              />
              <FieldError msg={errors.email?.message} />
            </div>
          </div>

          <div className="mt-6 space-y-4 font-barlow">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-lg font-semibold text-white/90">
                Déjà adhérent d’un club
              </span>

              <label className="inline-flex cursor-pointer select-none items-center gap-2">
                <input
                  type="checkbox"
                  className={CB}
                  checked={clubMember === true}
                  onChange={(e) =>
                    setValue("clubMember", e.target.checked, {
                      shouldValidate: true,
                    })
                  }
                />
                <span className="text-white/90">oui</span>
              </label>

              <label className="inline-flex cursor-pointer select-none items-center gap-2">
                <input
                  type="checkbox"
                  className={CB}
                  checked={clubMember === false}
                  onChange={(e) => {
                    setValue("clubMember", !e.target.checked, {
                      shouldValidate: true,
                    });
                    if (e.target.checked) {
                      setValue("competitionLicense", false, {
                        shouldValidate: true,
                      });
                    }
                  }}
                />
                <span className="text-white/90">non</span>
              </label>
            </div>

            <div
              className={`flex flex-wrap items-center gap-3 ${
                !clubMember ? "opacity-50" : ""
              }`}
            >
              <span className="text-lg font-semibold text-white/90">
                Si oui licence compétition
              </span>

              <label
                className={`inline-flex select-none items-center gap-2 ${
                  !clubMember ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <input
                  type="checkbox"
                  className={CB}
                  disabled={!clubMember}
                  checked={watch("competitionLicense") === true}
                  onChange={(e) =>
                    setValue("competitionLicense", e.target.checked, {
                      shouldValidate: true,
                    })
                  }
                />
                <span className="text-white/90">oui</span>
              </label>

              <label
                className={`inline-flex select-none items-center gap-2 ${
                  !clubMember ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <input
                  type="checkbox"
                  className={CB}
                  disabled={!clubMember}
                  checked={watch("competitionLicense") === false}
                  onChange={(e) =>
                    setValue("competitionLicense", !e.target.checked, {
                      shouldValidate: true,
                    })
                  }
                />
                <span className="text-white/90">non</span>
              </label>
            </div>
            <FieldError msg={errors.competitionLicense?.message} />

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-lg font-semibold text-white/90">Niveau</span>

              <label className="inline-flex cursor-pointer select-none items-center gap-2">
                <input
                  type="checkbox"
                  className={CB}
                  checked={watch("niveau") === "debutant"}
                  onChange={() =>
                    setValue("niveau", "debutant", { shouldValidate: true })
                  }
                />
                <span className="text-white/90">Débutant</span>
              </label>

              <label className="inline-flex cursor-pointer select-none items-center gap-2">
                <input
                  type="checkbox"
                  className={CB}
                  checked={watch("niveau") === "intermediaire"}
                  onChange={() =>
                    setValue("niveau", "intermediaire", {
                      shouldValidate: true,
                    })
                  }
                />
                <span className="text-white/90">Intermédiaire</span>
              </label>

              <label className="inline-flex cursor-pointer select-none items-center gap-2">
                <input
                  type="checkbox"
                  className={CB}
                  checked={watch("niveau") === "expert"}
                  onChange={() =>
                    setValue("niveau", "expert", { shouldValidate: true })
                  }
                />
                <span className="text-white/90">Expert</span>
              </label>
            </div>
            <FieldError msg={errors.niveau?.message} />
          </div>

          <div className="mt-6 space-y-4 text-white/90">
            <label
              className={`flex items-center gap-3 select-none ${
                participateOnlyParty
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }`}
            >
              <input
                type="checkbox"
                {...register("participateSurfLessons")}
                className={CB}
                disabled={participateOnlyParty}
              />
              <span className="text-lg">Participera aux cours de surf</span>
            </label>
            <FieldError msg={errors.participateSurfLessons?.message} />

            <div className="mt-4 space-y-4">
              <div className="grid gap-4 md:grid-cols-[1fr_280px] md:items-start">
                <div>
                  <label
                    className={`flex items-center gap-3 select-none ${
                      participateOnlyParty
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className={CB}
                      checked={participateParty}
                      disabled={participateOnlyParty}
                      onChange={(e) => toggleParty(e.target.checked)}
                    />
                    <span className="text-lg">Participera à la soirée</span>
                  </label>

                  <p className="mt-1 text-sm text-white/80">
                    Merci d’indiquer le nombre d’accompagnants (
                    <strong>0 si aucun</strong>).
                  </p>

                  <FieldError msg={errors.participateParty?.message} />
                </div>

                <div>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={10}
                    disabled={!participateParty || participateOnlyParty}
                    {...register("accompanyCountParty", {
                      setValueAs: (value) =>
                        value === "" ? undefined : Number(value),
                    })}
                    placeholder="NOMBRE D’ACCOMPAGNANTS"
                    className="w-full border border-white/30 bg-white px-4 py-3 font-bold text-black outline-none disabled:opacity-50"
                  />
                  <FieldError
                    msg={errors.accompanyCountParty?.message as
                      | string
                      | undefined}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-[1fr_280px] md:items-start">
                <div>
                  <label className="flex cursor-pointer select-none items-center gap-3">
                    <input
                      type="checkbox"
                      className={CB}
                      checked={participateOnlyParty}
                      onChange={(e) => toggleOnlyParty(e.target.checked)}
                    />
                    <span className="text-lg">
                      Participera uniquement à la soirée
                    </span>
                  </label>

                  <p className="mt-1 text-sm text-white/80">
                    Merci d’indiquer le nombre d’accompagnants (
                    <strong>0 si aucun</strong>).
                  </p>

                  <FieldError
                    msg={errors.participateOnlyParty?.message as
                      | string
                      | undefined}
                  />
                </div>

                <div>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={10}
                    disabled={!participateOnlyParty}
                    {...register("accompanyCountOnlyParty", {
                      setValueAs: (value) =>
                        value === "" ? undefined : Number(value),
                    })}
                    placeholder="NOMBRE D’ACCOMPAGNANTS"
                    className="w-full border border-white/30 bg-white px-4 py-3 font-bold text-black outline-none disabled:opacity-50"
                  />
                  <FieldError
                    msg={errors.accompanyCountOnlyParty?.message as
                      | string
                      | undefined}
                  />
                </div>
              </div>
            </div>

            <p className="text-lg">
              Fournir une copie de pièce d’identité et un certificat médical uniquement pour les compétiteurs ou photocopie de la licence 2026 à envoyer à{" "}
              <span className="text-lg font-semibold">
                contact@dentalsurfcontest.com
              </span>
            </p>
          </div>

          <input
            {...register("botField")}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          <div className="mt-12 flex justify-center">
            <button
              disabled={isSubmitting}
              className="font-barlow-condensed w-[300px] bg-blue hover:bg-yellow active:bg-yellow px-8 py-3 text-3xl font-extrabold text-black disabled:opacity-60"
            >
              {isSubmitting ? "ENVOI..." : "VALIDER"}
            </button>
          </div>

          {isSubmitSuccessful && !submitError && (
            <div className="flex flex-col items-center justify-center text-center">
              <p className="mt-6 text-white">
                Merci ! Votre inscription a bien été envoyée.
              </p>

              <p className="mt-3 text-sm text-gray-200 max-w-md">
                Un email de confirmation vient de vous être envoyé.
                Si vous ne le recevez pas dans les prochaines minutes,
                pensez à vérifier votre dossier <strong>spam / courrier indésirable</strong>.
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-col items-center text-center">
            <h3 className="font-barlow-condensed text-3xl font-bold leading-none text-white">
              MERCI A NOS PARTENAIRES
            </h3>

            <a
              href="mailto:contact@dentalsurfcontest.com"
              className="mt-6 inline-flex  px-12 py-3  items-center justify-center bg-white hover:bg-yellow active:bg-yellow  font-barlow-condensed text-2xl font-bold leading-none text-black"
            >
              CONTACT
            </a>
          </div>

          {submitError && (
            <p className="mt-6 text-center text-black">{submitError}</p>
          )}
        </form>
      </div>
    </section>
  );
}