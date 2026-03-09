import { NextResponse } from "next/server";
import { Resend } from "resend";
import { registrationSchema } from "@/lib/validation";

const resend = new Resend(process.env.RESEND_API_KEY);

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
      <h1>Confirmation de pré-inscription - Dental Surf Contest</h1>
      <p>Bonjour ${data.prenom} ${data.nom},</p>
      <p>Nous avons bien reçu votre pré-inscription au Dental Surf Contest.</p>

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

      <p>Pensez à envoyer votre copie de pièce d’identité et votre certificat médical.</p>
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