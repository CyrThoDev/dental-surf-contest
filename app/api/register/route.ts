import { NextResponse } from "next/server";
import { Resend } from "resend";
import { registrationSchema } from "@/lib/validation";

const resend = new Resend(process.env.RESEND_API_KEY);

const MAIL_THEME = {
  colors: {
    white: "#ffffff",
    black: "#171717",
    red: "#F15759",
    yellow: "#FFF4C4",
    blue: "#51DAE6",
    darkYellow: "#F0D459",
    border: "#eadfba",
    softBg: "#fff9e8",
    mutedText: "#6b7280",
    bodyText: "#2f2f2f",
  },
  fonts: {
    title: "'Agdasima', 'Arial Narrow', Arial, sans-serif",
    body: "'Barlow', Arial, Helvetica, sans-serif",
    condensed: "'Barlow Condensed', 'Arial Narrow', Arial, sans-serif",
  },
};

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

function rowParticipant(label: string, value: string | number) {
  return `
    <tr>
      <td style="
        padding:12px 16px;
        border-bottom:1px solid rgba(255,255,255,0.18);
        color:#171717;
        font-size:14px;
        vertical-align:top;
        width:42%;
        font-family:Arial, Helvetica, sans-serif;
        background:#ffffff;
      ">
        ${label}
      </td>
      <td style="
        padding:12px 16px;
        border-bottom:1px solid rgba(255,255,255,0.18);
        color:#171717;
        font-size:14px;
        font-weight:700;
        vertical-align:top;
        font-family:Arial, Helvetica, sans-serif;
        background:#ffffff;
      ">
        ${value}
      </td>
    </tr>
  `;
}

function rowAdmin(label: string, value: string | number) {
  return `
    <tr>
      <td style="
        padding:12px 16px;
        border-bottom:1px solid rgba(255,255,255,0.18);
        color:#171717;
        font-size:14px;
        vertical-align:top;
        width:42%;
        font-family:Arial, Helvetica, sans-serif;
        background:#ffffff;
      ">
        ${label}
      </td>
      <td style="
        padding:12px 16px;
        border-bottom:1px solid rgba(255,255,255,0.18);
        color:#171717;
        font-size:14px;
        font-weight:700;
        vertical-align:top;
        font-family:Arial, Helvetica, sans-serif;
        background:#ffffff;
      ">
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
      <title>Confirmation d'inscription au Dental Surf Contest 2026 </title>
    </head>
    <body style="margin:0;padding:0;background:#fff9e8;font-family:Arial, Helvetica, sans-serif;color:#171717;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fff9e8;margin:0;padding:32px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #e5e7eb;border-radius:20px;overflow:hidden;">
              
              <tr>
                <td style="padding:32px 32px 16px 32px;background:#ffffff;">
                  <div style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#F15759;font-weight:700;margin-bottom:10px;">
                    Dental Surf Contest 2026
                  </div>
                  <h1 style="margin:0;font-size:32px;line-height:1.1;font-weight:700;color:#171717;">
                    Confirmation de votre inscription - Dental Surf Contest 2026
                  </h1>
                  <p style="margin:16px 0 0 0;font-size:16px;line-height:1.6;color:#4b5563;">
                    Bonjour <strong>${data.prenom} ${data.nom}</strong>,<br />
                    Nous avons bien reçu votre inscription au <strong>Dental Surf Contest 2026</strong>.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding:0 32px 8px 32px;">
                  <div style="background:#F15759;border-radius:16px;padding:20px 22px;">
                    <div style="font-size:13px;color:#ffffff;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:8px;">
                      Événement
                    </div>
                    <div style="font-size:24px;line-height:1.2;font-weight:700;color:#ffffff;margin-bottom:8px;">
                      Dental Surf Contest 2026
                    </div>
                    <div style="font-size:15px;line-height:1.6;color:#ffffff;">
                      4 septembre 2026<br />
                      Club Surf Oldies, Capbreton
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding:24px 32px 8px 32px;">
                  <h2 style="margin:0 0 12px 0;font-size:18px;font-weight:700;color:#171717;">
                    Récapitulatif de votre inscription
                  </h2>

                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border-radius:14px;overflow:hidden;">
                    ${rowParticipant("Nom", data.nom)}
                    ${rowParticipant("Prénom", data.prenom)}
                    ${rowParticipant("Téléphone", data.telephone)}
                    ${rowParticipant("Email", data.email)}
                    ${rowParticipant("Déjà adhérent d’un club", formatBoolean(data.clubMember))}
                    ${rowParticipant("Licence compétition", formatBoolean(data.competitionLicense))}
                    ${rowParticipant("Niveau", formatNiveau(data.niveau))}
                    ${rowParticipant("Participera aux cours de surf", formatBoolean(data.participateSurfLessons))}
                    ${rowParticipant("Participera à la soirée", formatBoolean(data.participateParty))}
                    ${rowParticipant("Accompagnants soirée", data.accompanyCountParty ?? 0)}
                    ${rowParticipant("Participera uniquement à la soirée", formatBoolean(data.participateOnlyParty))}
                    ${rowParticipant("Accompagnants soirée seule", data.accompanyCountOnlyParty ?? 0)}
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding:20px 32px 0 32px;">
                  <div style="background:#FFF4C4;border:1px solid #F0D459;border-radius:14px;padding:18px 18px;">
                    <div style="font-size:14px;line-height:1.7;color:#374151;">
                      <strong style="color:#F15759;">Documents à envoyer :</strong><br />
                      Merci d’envoyer votre copie de pièce d’identité et votre certificat médical à contact@dentalsurfcontest.com.
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding:24px 32px 0 32px;" align="center">
                  <a
                    href="https://dentalsurfcontest.com"
                    style="display:inline-block;background:#171717;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 22px;border-radius:999px;"
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
      <title>Nouvelle inscription au Dental Surf Contest 2026</title>
    </head>
    <body style="margin:0;padding:0;background:#fff9e8;font-family:Arial, Helvetica, sans-serif;color:#171717;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fff9e8;margin:0;padding:32px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #e5e7eb;border-radius:20px;overflow:hidden;">
              
              <tr>
                <td style="padding:32px 32px 16px 32px;background:#ffffff;">
                  <div style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#F15759;font-weight:700;margin-bottom:10px;">
                    Dental Surf Contest 2026
                  </div>
                  <h1 style="margin:0;font-size:30px;line-height:1.1;font-weight:700;color:#171717;">
                    Nouvelle inscription - Dental Surf Contest 2026
                  </h1>
                  <p style="margin:16px 0 0 0;font-size:16px;line-height:1.6;color:#4b5563;">
                    Une nouvelle demande vient d’être enregistrée.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding:0 32px 8px 32px;">
                  <div style="background:#F15759;border-radius:16px;padding:18px 22px;">
                    <div style="font-size:13px;color:#ffffff;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:8px;">
                      Participant
                    </div>
                    <div style="font-size:24px;line-height:1.2;font-weight:700;color:#ffffff;">
                      ${data.prenom} ${data.nom}
                    </div>
                    <div style="font-size:15px;line-height:1.6;color:#ffffff;margin-top:8px;">
                      ${data.email}<br />
                      ${data.telephone}
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding:24px 32px 8px 32px;">
                  <h2 style="margin:0 0 12px 0;font-size:18px;font-weight:700;color:#171717;">
                    Détails de l’inscription
                  </h2>

                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border-radius:14px;overflow:hidden;">
                    ${rowAdmin("Nom", data.nom)}
                    ${rowAdmin("Prénom", data.prenom)}
                    ${rowAdmin("Téléphone", data.telephone)}
                    ${rowAdmin("Email", data.email)}
                    ${rowAdmin("Déjà adhérent d’un club", formatBoolean(data.clubMember))}
                    ${rowAdmin("Licence compétition", formatBoolean(data.competitionLicense))}
                    ${rowAdmin("Niveau", formatNiveau(data.niveau))}
                    ${rowAdmin("Participera aux cours de surf", formatBoolean(data.participateSurfLessons))}
                    ${rowAdmin("Participera à la soirée", formatBoolean(data.participateParty))}
                    ${rowAdmin("Accompagnants soirée", data.accompanyCountParty ?? 0)}
                    ${rowAdmin("Participera uniquement à la soirée", formatBoolean(data.participateOnlyParty))}
                    ${rowAdmin("Accompagnants soirée seule", data.accompanyCountOnlyParty ?? 0)}
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding:20px 32px 0 32px;">
                  <div style="background:#FFF4C4;border:1px solid #F0D459;border-radius:14px;padding:18px 18px;">
                    <div style="font-size:14px;line-height:1.7;color:#374151;">
                      <strong style="color:#F15759;">Action :</strong><br />
                      Vérifier les documents transmis.
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding:28px 32px 32px 32px;" align="center">
                  <p style="margin:0;font-size:12px;line-height:1.7;color:#9ca3af;">
                      Dental Surf Contest 2026
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
      subject: "Confirmation de votre inscription - Dental Surf Contest 2026",
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
      subject: `Nouvelle inscription - Dental Surf Contest 2026 - ${data.prenom} ${data.nom}`,
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