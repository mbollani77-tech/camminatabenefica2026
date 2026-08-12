# Portale Iscrizioni Camminata Benefica

Form iscrizione con quote per categoria (adulto/bambino/senior/agevolata),
pagamento con carta (Stripe) o contanti a inizio evento, pannello admin
per vedere ed esportare i partecipanti in CSV.

## 1. Crea gli account gratuiti

- **Supabase** → https://supabase.com → "New project" (scegli una password DB, annotala)
- **Stripe** → https://stripe.com → registrazione (resta in modalità "Test" finché non sei pronto a incassare davvero)
- **Vercel** → https://vercel.com → registrazione (puoi accedere direttamente con GitHub)

## 2. Configura Supabase

1. Nel progetto Supabase vai su **SQL Editor > New query**
2. Copia e incolla il contenuto di `supabase/schema.sql`, poi clicca **Run**
3. Vai su **Project Settings > API**: copia `Project URL`, `anon public key` e `service_role key`

## 3. Configura Stripe

1. Vai su **Developers > API keys**: copia la `Secret key` (inizia con `sk_test_...`)
2. Il webhook secret lo otterrai al punto 5, dopo il primo deploy

## 4. Carica il codice su GitHub

```bash
cd camminata-portal
git init
git add .
git commit -m "Primo commit"
```
Crea un nuovo repository vuoto su https://github.com/new, poi:
```bash
git remote add origin https://github.com/TUO-USERNAME/camminata-portal.git
git branch -M main
git push -u origin main
```

## 5. Deploy su Vercel

1. Su vercel.com clicca **Add New > Project**, seleziona il repository appena creato
2. Prima di fare deploy, apri **Environment Variables** e inserisci tutte le variabili
   presenti in `.env.example` con i valori reali raccolti ai punti 2-3
   (per `NEXT_PUBLIC_BASE_URL` metti l'URL che Vercel ti assegnerà, es. `https://camminata-benefica.vercel.app`)
3. Clicca **Deploy**
4. Una volta online, torna su Stripe → **Developers > Webhooks > Add endpoint**
   - URL: `https://TUO-DOMINIO.vercel.app/api/webhook`
   - Evento da ascoltare: `checkout.session.completed`
   - Copia il **Signing secret** (`whsec_...`) e aggiungilo su Vercel come `STRIPE_WEBHOOK_SECRET`
5. Su Vercel: **Settings > Environment Variables**, salva, poi **Deployments > Redeploy**

## 6. Test

- Apri il tuo sito, compila il form con pagamento carta
- Usa una carta di test Stripe: `4242 4242 4242 4242`, data futura qualsiasi, CVC qualsiasi
- Verifica che in Supabase (Table Editor > participants) lo stato diventi `paid`
- Vai su `/admin`, inserisci la password scelta in `ADMIN_PASSWORD` e controlla la lista + export CSV

## 7. Passare a pagamenti reali

Quando sei pronto a incassare veramente: in Stripe attiva l'account (dati fiscali/bancari),
passa dalle chiavi "Test" a quelle "Live" e aggiorna `STRIPE_SECRET_KEY` e
`STRIPE_WEBHOOK_SECRET` su Vercel con le versioni live.

## Sostituire la foto in home page

Nel design attuale la home ha una foto a piena larghezza in cima, con il titolo
sovrapposto (come nella locandina). Ho messo un placeholder verde a `public/hero.jpg`.

**Sostituiscila con una foto vera dell'edizione 2025** (o qualsiasi foto di gruppo
all'aperto che rappresenti l'evento):
1. Prendi una foto orizzontale, almeno 1200x800px
2. Rinominala `hero.jpg`
3. Sostituisci il file in `public/hero.jpg` con questa
4. Ricarica la pagina: il titolo resterà leggibile grazie all'overlay scuro automatico

## Pagamento in loco

L'opzione "pagamento in loco" (valore interno `cash` nel database, per compatibilità)
copre qualsiasi metodo usato il giorno dell'evento — contanti o POS — non solo contanti.
L'iscrizione resta con stato "in attesa" finché non la confermi manualmente dal
pannello `/admin` con il tasto "Segna gruppo pagato in loco".

## Iscrizioni multiple (gruppi/famiglie)

Una singola iscrizione può includere più partecipanti (es. una famiglia): nel form si
possono aggiungere righe con nome/cognome/categoria per ciascuno, mantenendo un'unica
email di contatto. Il totale è la somma delle quote e viene pagato con un solo checkout
Stripe (o segnato come "contanti" per tutto il gruppo insieme). In Supabase ogni
partecipante resta una riga separata, collegata alle altre tramite `group_id`: nel
pannello admin questo codice (primi 8 caratteri) è visibile nella colonna "Iscrizione"
per capire chi ha pagato insieme a chi.

## Personalizzare le quote

Modifica gli importi in due punti (devono restare allineati):
- `lib/pricing.js` (usato dal backend per calcolare l'importo reale)
- `app/page.js`, costante `CATEGORY_OPTIONS` (usato solo per mostrare il prezzo nel form)

## Nota privacy

La categoria "agevolata" è stata pensata per non chiedere esplicitamente il motivo
(disabilità, invalidità, ecc.), perché sarebbe un dato sensibile secondo il GDPR (art. 9).
Se ti serve raccogliere quel dato per motivi organizzativi, aggiungi un consenso
esplicito separato e un'informativa privacy dedicata.
