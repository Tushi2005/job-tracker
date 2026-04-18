# JobTracker – Frontend

Angular 21 alapú SPA (Single Page Application) állásjelentkezések nyomon követéséhez. Angular Material UI, JWT alapú hitelesítés, reszponzív design.

## Technológiai stack

- **Angular 21** – standalone components
- **TypeScript**
- **Angular Material** – UI komponens könyvtár
- **RxJS** – reaktív adatfolyamok
- **Angular Router** – kliens oldali navigáció
- **Docker + Nginx** – production deployment

## Projekt struktúra

```
src/app/
├── core/
│   ├── guards/
│   │   └── auth-guard.ts             # Route védelem JWT ellenőrzéssel
│   ├── interceptors/
│   │   └── auth.interceptor.ts       # Automatikus Bearer token csatolás
│   ├── models/
│   │   ├── applications.model.ts     # Application interface, Status enum
│   │   └── user.model.ts
│   └── services/
│       ├── auth.service.ts           # Bejelentkezés, regisztráció, token kezelés
│       ├── application.service.ts    # CRUD műveletek
│       └── autocomplete.service.ts   # Újrafelhasználható autocomplete logika
├── features/
│   ├── auth/
│   │   ├── login/                    # Bejelentkező oldal
│   │   └── register/                 # Regisztrációs oldal
│   └── applications/
│       ├── applications-list/        # Főoldal: táblázat, szűrés, státusz
│       ├── application-form/         # Új / szerkesztés űrlap
│       └── application-detail-dialog/ # Részletes nézet MatDialog-ban
└── environments/
    ├── environment.ts                # Fejlesztői konfiguráció
    └── environment.prod.ts           # Production konfiguráció
```

## Funkciók

- **Regisztráció és bejelentkezés** JWT tokennel
- **Jelentkezések listázása** rendezható táblázatban (cég, pozíció, státusz, dátum)
- **Új jelentkezés rögzítése** validált űrlapon
- **Meglévő jelentkezés szerkesztése** ugyanazon az űrlapon
- **Státusz frissítése** közvetlenül a táblázatból (PATCH kéréssel)
- **Részletes nézet** MatDialog-ban
- **Autocomplete** cég- és pozíciónevekhez a saját korábbi jelentkezések alapján
- **Reszponzív design** mobil eszközökre optimalizálva
- **Route védelem** AuthGuard-dal

## Útvonalak

| Útvonal | Komponens | Védett |
|---------|-----------|--------|
| `/login` | Login | – |
| `/register` | Register | – |
| `/applications` | ApplicationsList | ✓ |
| `/applications/new` | ApplicationForm | ✓ |
| `/applications/:id/edit` | ApplicationForm | ✓ |
| `/**` | → `/applications` | – |

## Komponensek

### Login / Register
Reactive Forms alapú oldalak validációval. A token és a felhasználónév localStorage-be kerül mentésre. Bejelentkezés után automatikus átirányítás `/applications`-re.

### ApplicationsList
A fő oldal bejelentkezés után. MatTable-ben jeleníti meg a jelentkezéseket MatSort rendezéssel. A státusz oszlopban MatSelect-tel közvetlenül módosítható az állapot PATCH kéréssel. Soronként megnyitható a részletes dialóg, illetve törölhető a jelentkezés.

### ApplicationForm
Kettős célú komponens: az URL-ben szereplő `:id` paraméter alapján dönti el, hogy új létrehozásról vagy szerkesztésről van-e szó. Autocomplete funkció cég- és pozíciónevekhez, amelyek a backendről töltődnek be.

### ApplicationDetailDialog
MatDialog-ban megjelenő részletes nézet Material ikonokkal. Az álláshirdetés linkje kattintható, a státusz színes chip formájában jelenik meg.

## Szolgáltatások

### AuthService
`HttpBackend`-et használ közvetlenül az interceptor megkerülésére, így az auth végpontokra nem kerül Bearer token. A bejelentkezett felhasználó neve Angular Signal-ként van tárolva (`signal<string | null>`).

### ApplicationService
CRUD műveletek. Az `authInterceptor` automatikusan csatolja a Bearer tokent minden kéréshez.

### AutocompleteFilterService
Újrafelhasználható service. A `createFilter` metódus egy `AbstractControl`-t és egy `Observable<string[]>`-t kap, és visszaad egy szűrt `Observable<string[]>`-t amely a form field értékváltozásaira reagál.

## Lokális fejlesztés

### Követelmények
- Node.js 20+
- Angular CLI
- Futó backend (`http://localhost:5000`)

### Indítás

```bash
npm install
ng serve
```

Az alkalmazás elérhető: `http://localhost:4200`

### Környezeti konfiguráció

**`src/environments/environment.ts`** (fejlesztői):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000'
};
```

**`src/environments/environment.prod.ts`** (production):
```typescript
export const environment = {
  production: true,
  apiUrl: 'http://<szerver-ip>:8080'
};
```

Az `angular.json` automatikusan cseréli `environment.ts`-t `environment.prod.ts`-re production build esetén.

### Production build

```bash
ng build
```

## CI/CD és Deployment

Kétlépéses Docker build:

1. **Build szakasz** – Node.js Alpine-ban Angular production build
2. **Serve szakasz** – Nginx Alpine-ban statikus fájlok kiszolgálása

Az Nginx konfiguráció SPA-barát: minden útvonalat `index.html`-re irányít vissza, így az Angular Router kliens oldali navigációja megfelelően működik.

## Verziókezelés

Feature branch workflow:

- `feat/models` – Angular modellek és interfészek
- `feat/core-services` – AuthService és ApplicationService
- `feat/core-interceptors` – JWT interceptor
- `feat/login-component` – bejelentkezési oldal
- `feat/register-component` – regisztrációs oldal
- `feat/applications-list` – főoldal táblázattal
- `feat/applications-form` – jelentkezés létrehozás/szerkesztés
- `feat/application-list-display` – rendezés, dialóg, státusz szerkesztés
- `feat/datalist-app-form` – autocomplete funkció

Commit üzenetek a Conventional Commits konvenció szerint készültek.

