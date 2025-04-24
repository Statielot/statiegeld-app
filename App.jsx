// Statielot App - React + Tailwind + Supabase (auth, backend & Emmeloord update)

// Supabase Schema: aanmaken via Supabase SQL-editor

/*
TABEL: users (aangemaakt via Supabase Auth automatisch)
- id (uuid, primary key)
- email (text)
- created_at (timestamp)

TABEL: ophaalverzoeken
- id (serial, primary key)
- user_id (uuid, foreign key -> users.id)
- flessen (integer)
- loten (integer)
- status (text: gepland / opgehaald / geannuleerd)
- qr_code (text) // unieke code per ophaalronde
- created_at (timestamp)

TABEL: medewerkers
- id (serial, primary key)
- user_id (uuid, foreign key -> users.id)
- naam (text)
- actief (boolean)

TABEL: routes
- id (serial, primary key)
- medewerker_id (integer, foreign key -> medewerkers.id)
- datum (date)
- starttijd (time)
- adres (text)
- status (text)
*/

// QR-functionaliteit:
// - Bij het aanmaken van een ophaalverzoek, wordt automatisch een unieke QR-code gegenereerd (bijv. UUID).
// - Medewerker scant QR-code bij ophalen.
// - Systeem markeert ophaalverzoek als 'opgehaald'.
// - Kan gecombineerd worden met een QR-scanner component (bijv. `react-qr-reader`).

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function StatielotApp() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [flessen, setFlessen] = useState(0);
  const [lotAantal, setLotAantal] = useState(0);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) alert("Login mislukt");
    else alert("Check je e-mail voor de inloglink");
    setLoading(false);
  };

  const planOphaalronde = async () => {
    const nieuweFlessen = flessen + 20;
    const nieuweLoten = lotAantal + 1;
    const qrCode = uuidv4();
    setFlessen(nieuweFlessen);
    setLotAantal(nieuweLoten);

    await supabase.from('ophaalverzoeken').insert({
      user_id: user.id,
      flessen: 20,
      loten: 1,
      status: 'gepland',
      qr_code: qrCode
    });
  };

  if (!user) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">Log in met je e-mail</h1>
        <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="jij@email.com" />
        <Button className="mt-4 w-full" onClick={handleLogin} disabled={loading}>
          {loading ? "Verzenden..." : "Stuur inloglink"}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-700">Statielot Emmeloord</h1>
      <Tabs defaultValue="klant">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="klant">Klant</TabsTrigger>
          <TabsTrigger value="medewerker">Medewerker</TabsTrigger>
        </TabsList>

        <TabsContent value="klant">
          <Card className="mt-4">
            <CardContent className="space-y-4">
              <h2 className="text-xl font-semibold">Jouw Statistieken</h2>
              <p>Totaal flessen/blikjes ingeleverd: <strong>{flessen}</strong></p>
              <p>Totaal ontvangen Staatsloten: <strong>{lotAantal}</strong></p>
              <p>Geschatte CO2-besparing: <strong>{flessen * 0.03} kg</strong></p>
              <Button onClick={planOphaalronde}>Plan nieuwe ophaalronde</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medewerker">
          <Card className="mt-4">
            <CardContent className="space-y-4">
              <h2 className="text-xl font-semibold">Route en Ophaalinfo</h2>
              <p>Vandaag te bezoeken adressen: 5</p>
              <p>Volgende adres: Van Goghstraat 12, 13:15 uur</p>
              <Input placeholder="Aantal flessen invoeren..." type="number" />
              <Button variant="outline">Bevestig ophaal (QR-scan simulatie)</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
