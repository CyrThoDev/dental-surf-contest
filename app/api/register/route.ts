import { NextResponse } from "next/server";
import { Resend } from "resend";
import { registrationSchema } from "@/lib/validation";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function formatBoolean(value: boolean) {
  return value ? "Oui" : "Non";
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
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
      <h1 style="margin-bottom: 24px;">Confirmation de pré-inscription - Dental Surf Contest</h1>

      <p>Bonjour ${data.prenom} ${data.nom},</p>

      <p>
        Nous avons bien reçu votre pré-inscription au Dental Surf Contest.
      </p>

      <p><strong>Récapitulatif de votre inscription :</strong></p>

      <ul>
        <li><strong>Nom :</strong> ${data.nom}</li>
        <li><strong>Prénom :</strong> ${data.prenom}</li>
        <li><strong>Téléphone :</strong> ${data.telephone}</li>
        <li><strong>Email :</strong> ${data.email}</li>
        <li><strong>Déjà adhérent d’un club :</strong> ${formatBoolean(data.clubMember)}</li>
        <li><strong>Licence compétition :</strong> ${formatBoolean(data.competitionLicense)}</li>
        <li><strong>Niveau :</strong> ${data.niveau}</li>
        <li><strong>Documents à fournir :</strong> ${formatBoolean(data.agreeDocs)}</li>
        <li><strong>Participera aux cours de surf :</strong> ${formatBoolean(data.participateSurfLessons)}</li>
        <li><strong>Participera à la soirée :</strong> ${formatBoolean(data.participateParty)}</li>
        <li><strong>Accompagnants soirée :</strong> ${data.accompanyCountParty ?? 0}</li>
        <li><strong>Participera uniquement à la soirée :</strong> ${formatBoolean(data.participateOnlyParty)}</li>
        <li><strong>Accompagnants soirée seule :</strong> ${data.accompanyCountOnlyParty ?? 0}</li>
      </ul>

      <p>
        Vous trouverez en pièce jointe un fichier agenda pour ajouter l’événement à votre calendrier.
      </p>

      <p>
        Pensez à envoyer votre copie de pièce d’identité et votre certificat médical.
      </p>

      <p>À bientôt,<br />Dental Surf Contest</p>
    </div>
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
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
      <h1>Nouvelle pré-inscription - Dental Surf Contest</h1>

      <ul>
        <li><strong>Nom :</strong> ${data.nom}</li>
        <li><strong>Prénom :</strong> ${data.prenom}</li>
        <li><strong>Téléphone :</strong> ${data.telephone}</li>
        <li><strong>Email :</strong> ${data.email}</li>
        <li><strong>Déjà adhérent d’un club :</strong> ${formatBoolean(data.clubMember)}</li>
        <li><strong>Licence compétition :</strong> ${formatBoolean(data.competitionLicense)}</li>
        <li><strong>Niveau :</strong> ${data.niveau}</li>
        <li><strong>Documents à fournir :</strong> ${formatBoolean(data.agreeDocs)}</li>
        <li><strong>Participera aux cours de surf :</strong> ${formatBoolean(data.participateSurfLessons)}</li>
        <li><strong>Participera à la soirée :</strong> ${formatBoolean(data.participateParty)}</li>
        <li><strong>Accompagnants soirée :</strong> ${data.accompanyCountParty ?? 0}</li>
        <li><strong>Participera uniquement à la soirée :</strong> ${formatBoolean(data.participateOnlyParty)}</li>
        <li><strong>Accompagnants soirée seule :</strong> ${data.accompanyCountOnlyParty ?? 0}</li>
      </ul>
    </div>
  `;
}

function buildCalendarIcs() {
  const uid = `dentalsurfcontest-2026-${Date.now()}@dentalsurf.fr`;

  // ⚠️ À ajuster si les horaires exacts sont différents
  // Exemple : 4 septembre 2026, 09:00 -> 18:00 Europe/Paris
  const dtStart = "20260904T090000";
  const dtEnd = "20260904T180000";

  const title = escapeIcsText("Dental Surf Contest 2026");
  const description = escapeIcsText(
    "Dental Surf Contest - Pré-inscription enregistrée. Lieu : Club Surf Oldies, Capbreton."
  );
  const location = escapeIcsText(
    "Club Surf Oldies, Promenade du front de mer, Plage du Prévent, Capbreton"
  );

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Dental Surf Contest//FR
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${uid}
DTSTAMP:20260309T120000Z
DTSTART;TZID=Europe/Paris:${dtStart}
DTEND;TZID=Europe/Paris:${dtEnd}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ log brut
    console.log("Payload brut reçu par /api/register :", body);

    const parsed = registrationSchema.safeParse(body);

    if (!parsed.success) {
      console.error("Erreurs validation Zod :", parsed.error.flatten());
      return NextResponse.json(
        {
          error: "Données invalides",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // ✅ log validé
    console.log("Payload validé :", data);

    const from = process.env.REGISTRATION_FROM_EMAIL;
    const notificationEmail = process.env.REGISTRATION_NOTIFICATION_EMAIL;

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY manquante");
      return NextResponse.json(
        { error: "Configuration email incomplète : RESEND_API_KEY manquante." },
        { status: 500 }
      );
    }

    if (!from) {
      console.error("REGISTRATION_FROM_EMAIL manquante");
      return NextResponse.json(
        { error: "Configuration email incomplète : REGISTRATION_FROM_EMAIL manquante." },
        { status: 500 }
      );
    }

    if (!notificationEmail) {
      console.error("REGISTRATION_NOTIFICATION_EMAIL manquante");
      return NextResponse.json(
        {
          error:
            "Configuration email incomplète : REGISTRATION_NOTIFICATION_EMAIL manquante.",
        },
        { status: 500 }
      );
    }

    const icsContent = buildCalendarIcs();
    const icsBase64 = Buffer.from(icsContent, "utf-8").toString("base64");

    // 1) Mail participant
    const participantMail = await resend.emails.send({
      from,
      to: data.email,
      subject: "Confirmation de votre pré-inscription - Dental Surf Contest",
      html: buildParticipantHtml(data),
      attachments: [
        {
          filename: "dental-surf-contest.ics",
          content: icsBase64,
        },
      ],
    });

    console.log("Résultat mail participant :", participantMail);

    // 2) Mail notification interne
    const adminMail = await resend.emails.send({
      from,
      to: notificationEmail,
      subject: `Nouvelle pré-inscription - ${data.prenom} ${data.nom}`,
      html: buildAdminHtml(data),
    });

    console.log("Résultat mail admin :", adminMail);

    return NextResponse.json({
      ok: true,
      message: "Pré-inscription enregistrée et emails envoyés.",
      participantMail,
      adminMail,
    });
  } catch (error) {
    console.error("Erreur API /api/register :", error);

    return NextResponse.json(
      {
        error: "Erreur serveur lors de l’inscription.",
      },
      { status: 500 }
    );
  }
}