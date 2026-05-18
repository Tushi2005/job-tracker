# JobTracker – Frontend

Angular 19 alapú SPA (Single Page Application) állásjelentkezések nyomon követéséhez. Angular Material UI, Bearer Token hitelesítés automatikus token-megújítással, Google OAuth, reszponzív design.

**Éles URL:** `https://jobtracker.adamcloud.hu`

## Technológiai stack

- **Angular 19** – standalone components, Angular 17+ control flow szintaxis (`@if`, `@for`)
- **TypeScript**
- **Angular Material** – UI komponens könyvtár
- **RxJS** – reaktív adatfolyamok, `takeUntilDestroyed`
- **Angular Router** – kliens oldali navigáció
- **Nginx** – production statikus fájl kiszolgálás

## Projekt struktúra

```
src/app/
├── core/
│   ├── constants/
│   │   └── app.constants.ts          # SNACKBAR_DURATION, DATE_FORMAT
│   ├── guards/
│   │   └── auth-guard.ts             # Route védelem token ellenőrzéssel
│   ├── interceptors/
│   │   └── auth.interceptor.ts       # Bearer token csatolás + 401 auto-refresh
│   ├── models/
│   │   ├── applications.model.ts     # Application interface, ApplicationStatus enum
│   │   └── user.model.ts
│   └── services/
│       ├── auth.service.ts           # Bejelentkezés, regisztráció, token kezelés
│       ├── application.service.ts    # CRUD műveletek (JSON Patch PATCH-hez)
│       └── autocomplete.service.ts   # Újrafelhasználható autocomplete logika
├── features/
│   ├── auth/
│   │   ├── login/                    # Bejelentkező oldal (email + Google)
│   │   ├── register/                 # Regisztrációs oldal (csak email/jelszó)
│   │   └── callback/                 # Google OAuth callback: token kinyerése URL-ből
│   └── applications/
│       ├── applications-list/        # Főoldal: táblázat, szűrés, státusz
│       ├── application-form/         # Új / szerkesztés űrlap autocomplete-tel
│       └── application-detail-dialog/ # Részletes nézet MatDialog-ban
└── environments/
    ├── environment.ts                # Fejlesztői konfiguráció
    └── environment.prod.ts           # Production konfiguráció
```

## Funkciók

- **Email/jelszó regisztráció és bejelentkezés** Bearer tokennel
- **Google OAuth bejelentkezés** – ha nincs fiók, a backend automatikusan regisztrálja
- **Automatikus token megújítás** – 401-es hiba esetén az interceptor refresh tokennel kér új tokenpárt, majd megismétli az eredeti kérést
- **Jelentkezések listázása** rendezható táblázatban (cég, pozíció, státusz, dátum)
- **Új jelentkezés rögzítése** validált űrlapon
- **Meglévő jelentkezés szerkesztése** ugyanazon az űrlapon
- **Státusz frissítése** közvetlenül a táblázatból (JSON Patch PATCH kéréssel)
- **Részletes nézet** MatDialog-ban
- **Autocomplete** cég- és pozíciónevekhez a saját korábbi jelentkezések alapján
- **Reszponzív design** mobil eszközökre optimalizálva
- **Route védelem** AuthGuard-dal

## Útvonalak

| Útvonal | Komponens | Védett |
|---------|-----------|--------|
| `/login` | Login | – |
| `/register` | Register | – |
| `/auth/callback` | AuthCallback | – |
| `/applications` | ApplicationsList | ✓ |
| `/applications/new` | ApplicationForm | ✓ |
| `/applications/:id/edit` | ApplicationForm | ✓ |
| `/**` | → `/applications` | – |

## Hitelesítés

### Token kezelés

Az access token és refresh token `localStorage`-ban tárolódik. Az `authInterceptor` minden kérésre automatikusan csatolja a Bearer tokent. Ha a szerver 401-et ad vissza:

1. Az interceptor megpróbálja megújítani a tokent (`POST /refresh`)
2. Sikeres megújítás esetén frissíti a `localStorage`-t, és megismétli az eredeti kérést
3. Ha a refresh is meghiúsul, a felhasználót kijelentkezteti

### Google OAuth flow

1. A felhasználó a login oldalon a Google gombra kattint
2. Az app a backend `/api/auth/google` végpontjára navigál
3. A backend Google-ra irányítja (fiókválasztóval – `prompt=select_account`)
4. Sikeres bejelentkezés után a backend az `/auth/callback` oldalra irányít vissza token paraméterekkel
5. A callback komponens kinyeri a tokeneket az URL-ből, `localStorage`-ba menti, majd átirányít `/applications`-re

## Komponensek

### Login
Email/jelszó bejelentkezés és Google OAuth gomb. Reactive Forms alapú, validációval.

### Register
Csak email/jelszó regisztráció – Google esetén a backend automatikusan regisztrálja a felhasználót, nincs szükség külön regisztrációra.

### ApplicationsList
A fő oldal bejelentkezés után. MatTable-ben jeleníti meg a jelentkezéseket MatSort rendezéssel. A státusz oszlopban MatSelect-tel közvetlenül módosítható az állapot PATCH kéréssel. Soronként megnyitható a részletes dialóg, illetve törölhető a jelentkezés.

### ApplicationForm
Kettős célú komponens: az URL-ben szereplő `:id` paraméter alapján dönti el, hogy új létrehozásról vagy szerkesztésről van-e szó. Autocomplete funkció cég- és pozíciónevekhez.

### ApplicationDetailDialog
MatDialog-ban megjelenő részletes nézet Material ikonokkal. Az álláshirdetés linkje kattintható, a státusz színes chip formájában jelenik meg.

## Szolgáltatások

### AuthService
`HttpBackend`-et használ közvetlenül az interceptor megkerülésére, így az auth végpontokra nem kerül Bearer token. A bejelentkezett felhasználó neve Angular Signal-ként van tárolva.

### ApplicationService
CRUD műveletek. A `patch()` metódus JSON Patch RFC 6902 formátumban küldi az adatokat:
```typescript
const patchDoc = Object.entries(data).map(([key, value]) => ({
    op: 'replace',
    path: `/${key}`,
    value
}));
```

### AutocompleteFilterService
Újrafelhasználható service. A `createFilter` metódus egy `AbstractControl`-t és egy `Observable<string[]>`-t kap, és visszaad egy szűrt `Observable<string[]>`-t amely a form field értékváltozásaira reagál.

## Lokális fejlesztés

### Követelmények
- Node.js 20+
- Angular CLI
- Futó backend (`https://localhost:7194`)

### Indítás

```bash
npm install
ng serve
```

Az alkalmazás elérhető: `http://localhost:4200`

> **Megjegyzés:** Google OAuth lokálisan csak akkor működik, ha a böngészőben előbb elfogadtad a backend self-signed tanúsítványát (`https://localhost:7194/api/me`).

### Környezeti konfiguráció

**`src/environments/environment.ts`** (fejlesztői):
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7194'
};
```

**`src/environments/environment.prod.ts`** (production):
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://jobtracker-api.adamcloud.hu'
};
```

## CI/CD és Deployment

A frontend deployment manuális vagy külön pipeline-nal zajlik. Production build:

```bash
ng build
```

Az `angular.json` automatikusan cseréli `environment.ts`-t `environment.prod.ts`-re production build esetén.

Nginx konfiguráció SPA-barát: minden útvonalat `index.html`-re irányít vissza, így az Angular Router kliens oldali navigációja megfelelően működik.

## Verziókezelés

Feature branch workflow, Conventional Commits konvenció szerint:

- `feat/models` – Angular modellek és interfészek
- `feat/core-services` – AuthService és ApplicationService
- `feat/core-interceptors` – Bearer token interceptor
- `feat/login-component` – bejelentkezési oldal
- `feat/register-component` – regisztrációs oldal
- `feat/applications-list` – főoldal táblázattal
- `feat/applications-form` – jelentkezés létrehozás/szerkesztés
- `feat/application-list-display` – rendezés, dialóg, státusz szerkesztés
- `feat/datalist-app-form` – autocomplete funkció
- `feat/google-auth` – Google OAuth callback, token auto-refresh interceptor
- `refactor/cleanup` – kód tisztítás, takeUntilDestroyed, Angular 17+ szintaxis
