import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "API - Système d'Aides à la Gestion d'Etablissements Scolaires (SAGES) // Complexe Scolaire le Savoir - Togo" });
}
