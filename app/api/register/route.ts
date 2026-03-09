import { NextResponse } from "next/server";
import { Resend } from "resend";
import { registrationSchema } from "@/lib/validation";

const resend = new Resend(process.env.RESEND_API_KEY);

function formatBoolean(value: boolean) {
  return value ? "Oui" : "Non";
}

function formatNiveau(value: "debutant" | "intermediaire" | "expert") {
  switch (value) {
    case "debutant":
      return "Débutant";
    case "intermediaire":
      return "Intermédiaire";
    case "expert":
      return "Expert";
    default:
      return value;
  }
}

function row(label: string, value: string | number) {
  return `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #ececec;color:#6b7280;font-size:14px;vertical-align:top;width:42%;">
        ${label}
      </td>
      <td style="padding:12px 0;border-bottom:1px solid #ececec;color:#111827;font-size:14px;font-weight:600;vertical-align:top;">
        ${value}
      </td>
    </tr>
  `;
}
function buildParticipantHtml(data: {
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  clubMember: boolean;
  competitionLicense: boolean;
  niveau: "debutant" | "intermediaire" | "expert";
  agreeDocs: boolean;
  participateSurfLessons: boolean;
  participateParty: boolean;
  accompanyCountParty?: number;
  participateOnlyParty: boolean;
  accompanyCountOnlyParty?: number;
}) {
  return `
  <!doctype html>
  <html lang="fr">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Confirmation de pré-inscription</title>
    </head>
    <body style="margin:0;padding:0;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111827;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f5f7;margin:0;padding:32px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #e5e7eb;border-radius:20px;overflow:hidden;">
              
              <tr>
                <td style="padding:32px 32px 16px 32px;background:#ffffff;">
                  <div style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;font-weight:700;margin-bottom:10px;">
                    Dental Surf Contest
                  </div>
                  <h1 style="margin:0;font-size:32px;line-height:1.1;font-weight:700;color:#111827;">
                    Confirmation de votre pré-inscription
                  </h1>
                  <p style="margin:16px 0 0 0;font-size:16px;line-height:1.6;color:#4b5563;">
                    Bonjour <strong>${data.prenom} ${data.nom}</strong>,<br />
                    Nous avons bien reçu votre pré-inscription au <strong>Dental Surf Contest</strong>.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding:0 32px 8px 32px;">
                  <div style="background:linear-gradient(135deg,#0f172a 0%,#1e3a8a 100%);border-radius:16px;padding:20px 22px;">
                    <div style="font-size:13px;color:#cbd5e1;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:8px;">
                      Événement
                    </div>
                    <div style="font-size:24px;line-height:1.2;font-weight:700;color:#ffffff;margin-bottom:8px;">
                      Dental Surf Contest 2026
                    </div>
                    <div style="font-size:15px;line-height:1.6;color:#e5e7eb;">
                      4 septembre 2026<br />
                      Club Surf Oldies, Capbreton
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding:24px 32px 8px 32px;">
                  <h2 style="margin:0 0 12px 0;font-size:18px;font-weight:700;color:#111827;">
                    Récapitulatif de votre inscription
                  </h2>

                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                    ${row("Nom", data.nom)}
                    ${row("Prénom", data.prenom)}
                    ${row("Téléphone", data.telephone)}
                    ${row("Email", data.email)}
                    ${row("Déjà adhérent d’un club", formatBoolean(data.clubMember))}
                    ${row("Licence compétition", formatBoolean(data.competitionLicense))}
                    ${row("Niveau", formatNiveau(data.niveau))}
                    ${row("Documents à fournir", formatBoolean(data.agreeDocs))}
                    ${row("Participera aux cours de surf", formatBoolean(data.participateSurfLessons))}
                    ${row("Participera à la soirée", formatBoolean(data.participateParty))}
                    ${row("Accompagnants soirée", data.accompanyCountParty ?? 0)}
                    ${row("Participera uniquement à la soirée", formatBoolean(data.participateOnlyParty))}
                    ${row("Accompagnants soirée seule", data.accompanyCountOnlyParty ?? 0)}
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding:20px 32px 0 32px;">
                  <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:14px;padding:18px 18px;">
                    <div style="font-size:14px;line-height:1.7;color:#374151;">
                      <strong style="color:#111827;">Documents à envoyer :</strong><br />
                      Merci d’envoyer votre copie de pièce d’identité et votre certificat médical à l’organisation.
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding:24px 32px 0 32px;" align="center">
                  <a
                    href="https://dentalsurfcontest.com"
                    style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 22px;border-radius:999px;"
                  >
                    Voir le site
                  </a>
                </td>
              </tr>

              <tr>
                <td style="padding:18px 32px 0 32px;" align="center">
                  <p style="margin:0;font-size:13px;line-height:1.7;color:#6b7280;">
                    Un fichier agenda est joint à cet email pour vous permettre d’ajouter l’événement à votre calendrier.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding:28px 32px 32px 32px;" align="center">
                  <p style="margin:0;font-size:12px;line-height:1.7;color:#9ca3af;">
                    Dental Surf Contest • Capbreton • 4 septembre 2026
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}
function buildAdminHtml(data: {
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  clubMember: boolean;
  competitionLicense: boolean;
  niveau: "debutant" | "intermediaire" | "expert";
  agreeDocs: boolean;
  participateSurfLessons: boolean;
  participateParty: boolean;
  accompanyCountParty?: number;
  participateOnlyParty: boolean;
  accompanyCountOnlyParty?: number;
}) {
  return `
  <!doctype html>
  <html lang="fr">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Nouvelle pré-inscription</title>
    </head>
    <body style="margin:0;padding:0;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111827;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f5f7;margin:0;padding:32px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #e5e7eb;border-radius:20px;overflow:hidden;">
              
              <tr>
                <td style="padding:32px 32px 16px 32px;">
                  <div style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;font-weight:700;margin-bottom:10px;">
                    Dental Surf Contest
                  </div>
                  <h1 style="margin:0;font-size:30px;line-height:1.1;font-weight:700;color:#111827;">
                    Nouvelle pré-inscription
                  </h1>
                  <p style="margin:16px 0 0 0;font-size:16px;line-height:1.6;color:#4b5563;">
                    Une nouvelle demande vient d’être enregistrée.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding:0 32px 8px 32px;">
                  <div style="background:linear-gradient(135deg,#7c2d12 0%,#b91c1c 100%);border-radius:16px;padding:18px 22px;">
                    <div style="font-size:13px;color:#fee2e2;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:8px;">
                      Participant
                    </div>
                    <div style="font-size:24px;line-height:1.2;font-weight:700;color:#ffffff;">
                      ${data.prenom} ${data.nom}
                    </div>
                    <div style="font-size:15px;line-height:1.6;color:#fee2e2;margin-top:8px;">
                      ${data.email}<br />
                      ${data.telephone}
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding:24px 32px 8px 32px;">
                  <h2 style="margin:0 0 12px 0;font-size:18px;font-weight:700;color:#111827;">
                    Détails de la réservation
                  </h2>

                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                    ${row("Nom", data.nom)}
                    ${row("Prénom", data.prenom)}
                    ${row("Téléphone", data.telephone)}
                    ${row("Email", data.email)}
                    ${row("Déjà adhérent d’un club", formatBoolean(data.clubMember))}
                    ${row("Licence compétition", formatBoolean(data.competitionLicense))}
                    ${row("Niveau", formatNiveau(data.niveau))}
                    ${row("Documents à fournir", formatBoolean(data.agreeDocs))}
                    ${row("Participera aux cours de surf", formatBoolean(data.participateSurfLessons))}
                    ${row("Participera à la soirée", formatBoolean(data.participateParty))}
                    ${row("Accompagnants soirée", data.accompanyCountParty ?? 0)}
                    ${row("Participera uniquement à la soirée", formatBoolean(data.participateOnlyParty))}
                    ${row("Accompagnants soirée seule", data.accompanyCountOnlyParty ?? 0)}
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding:20px 32px 0 32px;">
                  <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:14px;padding:18px 18px;">
                    <div style="font-size:14px;line-height:1.7;color:#7c2d12;">
                      <strong style="color:#9a3412;">Action :</strong><br />
                      Vérifier les documents transmis et suivre la confirmation de l’inscription.
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding:28px 32px 32px 32px;" align="center">
                  <p style="margin:0;font-size:12px;line-height:1.7;color:#9ca3af;">
                    Notification automatique • Dental Surf Contest
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Payload brut reçu :", body);

    const parsed = registrationSchema.safeParse(body);

    if (!parsed.success) {
      console.error("Erreurs validation Zod :", parsed.error.flatten());
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const from = process.env.REGISTRATION_FROM_EMAIL;
    const notificationEmail = process.env.REGISTRATION_NOTIFICATION_EMAIL;

    console.log("FROM =", from);
    console.log("TO participant =", data.email);
    console.log("TO admin =", notificationEmail);

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "RESEND_API_KEY manquante" },
        { status: 500 }
      );
    }

    if (!from) {
      return NextResponse.json(
        { error: "REGISTRATION_FROM_EMAIL manquante" },
        { status: 500 }
      );
    }

    if (!notificationEmail) {
      return NextResponse.json(
        { error: "REGISTRATION_NOTIFICATION_EMAIL manquante" },
        { status: 500 }
      );
    }

    const participantMail = await resend.emails.send({
      from: `Dental Surf Contest <${from}>`,
      to: [data.email],
      subject: "Confirmation de votre pré-inscription - Dental Surf Contest",
      html: buildParticipantHtml(data),
    });

    console.log("participantMail =", participantMail);

    if (participantMail.error) {
      console.error("Erreur mail participant :", participantMail.error);
      return NextResponse.json(
        { error: "Erreur envoi mail participant", details: participantMail.error },
        { status: 500 }
      );
    }

    const adminMail = await resend.emails.send({
      from: `Dental Surf Contest <${from}>`,
      to: [notificationEmail],
      subject: `Nouvelle pré-inscription - ${data.prenom} ${data.nom}`,
      html: buildAdminHtml(data),
    });

    console.log("adminMail =", adminMail);

    if (adminMail.error) {
      console.error("Erreur mail admin :", adminMail.error);
      return NextResponse.json(
        { error: "Erreur envoi mail admin", details: adminMail.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      participantMail: participantMail.data,
      adminMail: adminMail.data,
    });
  } catch (error) {
    console.error("Erreur API /api/register :", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de l’inscription." },
      { status: 500 }
    );
  }
}