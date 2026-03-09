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

function row(label: string, value: string | number) {
  return `
    <tr>
      <td style="
        padding:14px 0;
        border-bottom:1px solid ${MAIL_THEME.colors.border};
        color:${MAIL_THEME.colors.mutedText};
        font-size:14px;
        line-height:1.5;
        vertical-align:top;
        width:42%;
        font-family:${MAIL_THEME.fonts.body};
      ">
        ${label}
      </td>
      <td style="
        padding:14px 0;
        border-bottom:1px solid ${MAIL_THEME.colors.border};
        color:${MAIL_THEME.colors.black};
        font-size:15px;
        line-height:1.5;
        font-weight:700;
        vertical-align:top;
        font-family:${MAIL_THEME.fonts.body};
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
      <title>Confirmation d'inscription au Dental Surf Contest</title>
    </head>
    <body style="
      margin:0;
      padding:0;
      background:${MAIL_THEME.colors.yellow};
      font-family:${MAIL_THEME.fonts.body};
      color:${MAIL_THEME.colors.bodyText};
    ">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="
        background:${MAIL_THEME.colors.yellow};
        margin:0;
        padding:36px 16px;
      ">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="
              max-width:640px;
              background:${MAIL_THEME.colors.white};
              border:1px solid ${MAIL_THEME.colors.border};
              border-radius:24px;
              overflow:hidden;
            ">
              
              <tr>
                <td style="
                  padding:34px 32px 18px 32px;
                  background:${MAIL_THEME.colors.white};
                ">
                  <div style="
                    font-size:12px;
                    letter-spacing:0.14em;
                    text-transform:uppercase;
                    color:${MAIL_THEME.colors.red};
                    font-weight:700;
                    margin-bottom:12px;
                    font-family:${MAIL_THEME.fonts.condensed};
                  ">
                    Dental Surf Contest
                  </div>

                  <h1 style="
                    margin:0;
                    font-size:36px;
                    line-height:1;
                    font-weight:700;
                    color:${MAIL_THEME.colors.black};
                    font-family:${MAIL_THEME.fonts.title};
                  ">
                    Confirmation de votre pré-inscription
                  </h1>

                  <p style="
                    margin:18px 0 0 0;
                    font-size:16px;
                    line-height:1.7;
                    color:${MAIL_THEME.colors.bodyText};
                    font-family:${MAIL_THEME.fonts.body};
                  ">
                    Bonjour <strong>${data.prenom} ${data.nom}</strong>,<br />
                    Nous avons bien reçu votre pré-inscription au
                    <strong>Dental Surf Contest</strong>.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding:0 32px 10px 32px;">
                  <div style="
                    background:linear-gradient(135deg, ${MAIL_THEME.colors.blue} 0%, ${MAIL_THEME.colors.darkYellow} 100%);
                    border-radius:18px;
                    padding:22px 24px;
                  ">
                    <div style="
                      font-size:12px;
                      color:${MAIL_THEME.colors.black};
                      font-weight:700;
                      letter-spacing:0.10em;
                      text-transform:uppercase;
                      margin-bottom:8px;
                      font-family:${MAIL_THEME.fonts.condensed};
                    ">
                      Événement
                    </div>

                    <div style="
                      font-size:28px;
                      line-height:1.1;
                      font-weight:700;
                      color:${MAIL_THEME.colors.black};
                      margin-bottom:8px;
                      font-family:${MAIL_THEME.fonts.title};
                    ">
                      Dental Surf Contest 2026
                    </div>

                    <div style="
                      font-size:15px;
                      line-height:1.7;
                      color:${MAIL_THEME.colors.black};
                      font-family:${MAIL_THEME.fonts.body};
                    ">
                      4 septembre 2026<br />
                      Club Surf Oldies, Capbreton
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding:26px 32px 8px 32px;">
                  <h2 style="
                    margin:0 0 14px 0;
                    font-size:24px;
                    line-height:1.1;
                    font-weight:700;
                    color:${MAIL_THEME.colors.black};
                    font-family:${MAIL_THEME.fonts.title};
                  ">
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
                <td style="padding:22px 32px 0 32px;">
                  <div style="
                    background:${MAIL_THEME.colors.softBg};
                    border:1px solid ${MAIL_THEME.colors.border};
                    border-radius:16px;
                    padding:18px 18px;
                  ">
                    <div style="
                      font-size:14px;
                      line-height:1.8;
                      color:${MAIL_THEME.colors.bodyText};
                      font-family:${MAIL_THEME.fonts.body};
                    ">
                      <strong style="color:${MAIL_THEME.colors.red};">Documents à envoyer :</strong><br />
                      Merci d’envoyer votre copie de pièce d’identité et votre certificat médical à l’organisation.
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding:26px 32px 0 32px;" align="center">
                  <a
                    href="https://dentalsurfcontest.com"
                    style="
                      display:inline-block;
                      background:${MAIL_THEME.colors.red};
                      color:${MAIL_THEME.colors.white};
                      text-decoration:none;
                      font-size:15px;
                      font-weight:700;
                      padding:14px 24px;
                      border-radius:999px;
                      font-family:${MAIL_THEME.fonts.body};
                    "
                  >
                    Voir le site
                  </a>
                </td>
              </tr>

              <tr>
                <td style="padding:18px 32px 0 32px;" align="center">
                  <p style="
                    margin:0;
                    font-size:13px;
                    line-height:1.7;
                    color:${MAIL_THEME.colors.mutedText};
                    font-family:${MAIL_THEME.fonts.body};
                  ">
                    Un fichier agenda est joint à cet email pour vous permettre d’ajouter l’événement à votre calendrier.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding:30px 32px 34px 32px;" align="center">
                  <p style="
                    margin:0;
                    font-size:12px;
                    line-height:1.7;
                    color:${MAIL_THEME.colors.mutedText};
                    font-family:${MAIL_THEME.fonts.body};
                  ">
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
      <title>Nouvelle inscription au Dental Surf Contest</title>
    </head>
    <body style="
      margin:0;
      padding:0;
      background:${MAIL_THEME.colors.yellow};
      font-family:${MAIL_THEME.fonts.body};
      color:${MAIL_THEME.colors.bodyText};
    ">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="
        background:${MAIL_THEME.colors.yellow};
        margin:0;
        padding:36px 16px;
      ">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="
              max-width:640px;
              background:${MAIL_THEME.colors.white};
              border:1px solid ${MAIL_THEME.colors.border};
              border-radius:24px;
              overflow:hidden;
            ">
              
              <tr>
                <td style="padding:34px 32px 18px 32px;">
                  <div style="
                    font-size:12px;
                    letter-spacing:0.14em;
                    text-transform:uppercase;
                    color:${MAIL_THEME.colors.red};
                    font-weight:700;
                    margin-bottom:12px;
                    font-family:${MAIL_THEME.fonts.condensed};
                  ">
                    Dental Surf Contest
                  </div>

                  <h1 style="
                    margin:0;
                    font-size:34px;
                    line-height:1;
                    font-weight:700;
                    color:${MAIL_THEME.colors.black};
                    font-family:${MAIL_THEME.fonts.title};
                  ">
                    Nouvelle pré-inscription
                  </h1>

                  <p style="
                    margin:18px 0 0 0;
                    font-size:16px;
                    line-height:1.7;
                    color:${MAIL_THEME.colors.bodyText};
                    font-family:${MAIL_THEME.fonts.body};
                  ">
                    Une nouvelle demande vient d’être enregistrée.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding:0 32px 10px 32px;">
                  <div style="
                    background:${MAIL_THEME.colors.red};
                    border-radius:18px;
                    padding:22px 24px;
                  ">
                    <div style="
                      font-size:12px;
                      color:${MAIL_THEME.colors.yellow};
                      font-weight:700;
                      letter-spacing:0.10em;
                      text-transform:uppercase;
                      margin-bottom:8px;
                      font-family:${MAIL_THEME.fonts.condensed};
                    ">
                      Participant
                    </div>

                    <div style="
                      font-size:28px;
                      line-height:1.1;
                      font-weight:700;
                      color:${MAIL_THEME.colors.white};
                      font-family:${MAIL_THEME.fonts.title};
                    ">
                      ${data.prenom} ${data.nom}
                    </div>

                    <div style="
                      font-size:15px;
                      line-height:1.7;
                      color:${MAIL_THEME.colors.yellow};
                      margin-top:10px;
                      font-family:${MAIL_THEME.fonts.body};
                    ">
                      ${data.email}<br />
                      ${data.telephone}
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding:26px 32px 8px 32px;">
                  <h2 style="
                    margin:0 0 14px 0;
                    font-size:24px;
                    line-height:1.1;
                    font-weight:700;
                    color:${MAIL_THEME.colors.black};
                    font-family:${MAIL_THEME.fonts.title};
                  ">
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
                <td style="padding:22px 32px 0 32px;">
                  <div style="
                    background:${MAIL_THEME.colors.softBg};
                    border:1px solid ${MAIL_THEME.colors.border};
                    border-radius:16px;
                    padding:18px 18px;
                  ">
                    <div style="
                      font-size:14px;
                      line-height:1.8;
                      color:${MAIL_THEME.colors.bodyText};
                      font-family:${MAIL_THEME.fonts.body};
                    ">
                      <strong style="color:${MAIL_THEME.colors.red};">Action :</strong><br />
                      Vérifier les documents transmis et suivre la confirmation de l’inscription.
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding:30px 32px 34px 32px;" align="center">
                  <p style="
                    margin:0;
                    font-size:12px;
                    line-height:1.7;
                    color:${MAIL_THEME.colors.mutedText};
                    font-family:${MAIL_THEME.fonts.body};
                  ">
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