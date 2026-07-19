# Deployment

## Deployment moved from Strapi Cloud to Render

This CMS previously deployed to **Strapi Cloud**, which auto-deployed from `main`.
It now deploys to **Render** using a [Blueprint](https://render.com/docs/blueprint-spec):
a single [`render.yaml`](../render.yaml) at the repo root that describes the whole
service (web process, persistent disk, env vars). Render reads it and provisions
everything — no manual dashboard wiring.

- **Tracked branch:** `render-deploy` during testing, so `main` (still wired to Strapi
  Cloud) is untouched. The branch gets flipped to `main` at cutover.
- **Plan:** `starter` (paid). A persistent disk requires a paid plan — Render's Free
  tier can't attach one. Starter also never sleeps, so static-site (SSG) builds on
  the frontend always reach a warm CMS.

## Why the database config had to change — persistence is now our job

Strapi Cloud managed durable storage **invisibly**: it gave the app a real database
and real media storage behind the scenes, so the repo's defaults (`.tmp/data.db`,
local `public/uploads`) survived every deploy without any effort on our side.

Render's model is different. The app's own filesystem is **ephemeral** — rebuilt from
git on every deploy. The **only** durable location is the persistent disk, mounted at
`/data` (`sizeGB: 1`). So both the database and the uploaded media must be forced onto
`/data`, or a redeploy silently wipes them. **This already caused real data loss** —
which is why it's documented here.

Strapi gives a **different lever for each**, so we use two different mechanisms:

| Data     | Lever                                                       | Why                                                                    |
| -------- | ----------------------------------------------------------- | ---------------------------------------------------------------------- |
| Database | Config setting (`DATABASE_FILENAME` + a `database.ts` edit) | Strapi exposes the SQLite path, so we point it at the disk             |
| Uploads  | Filesystem symlink                                          | The local upload provider hardcodes the path — no config option exists |

It's not two mechanisms by choice — it's "use config where config exists, symlink
where it doesn't."

## Database — config setting

`render.yaml` sets the SQLite file to an absolute path on the disk:

```yaml
- key: DATABASE_CLIENT
  value: sqlite
- key: DATABASE_FILENAME
  value: /data/data.db
```

**The env var alone is not enough.** The original `config/database.ts` built the
path like this:

```ts
filename: path.join(__dirname, '..', '..', env('DATABASE_FILENAME', '.tmp/data.db')),
```

`path.join` does **not** treat an absolute path as a root — it just glues segments
together. So `/data/data.db` resolved to:

```
/opt/render/project/src/dist/config  +  ..  +  ..  +  /data/data.db
= /opt/render/project/src/data/data.db   ← inside the app folder = EPHEMERAL, not the disk
```

The DB was written there, so every redeploy rebuilt the app folder and erased it. On
Strapi Cloud this bug never showed, because Cloud never used this path for real storage.

The fix (already applied in [`config/database.ts`](../config/database.ts)) makes the
path honor an absolute value:

```ts
sqlite: {
  connection: {
    filename: (() => {
      const file = env("DATABASE_FILENAME", ".tmp/data.db");
      return path.isAbsolute(file)
        ? file
        : path.join(__dirname, "..", "..", file);
    })(),
  },
  useNullAsDefault: true,
},
```

Local dev is unchanged (the relative default is still joined); on Render the absolute
`/data/data.db` is used verbatim, landing on the disk.

## Uploads — symlink strategy

Strapi's local upload provider **hardcodes** `public/uploads` — there is no "upload
path" config option. When you can't configure the path, the only lever left is a
filesystem trick: symlink `public/uploads` → `/data/uploads`. That's what the
`startCommand` in [`render.yaml`](../render.yaml) does:

```yaml
startCommand: rm -rf public/uploads && mkdir -p /data/uploads && ln -s /data/uploads public/uploads && npm run start
```

Four moves:

1. `rm -rf public/uploads` — delete the **real** folder that ships in the repo.
2. `mkdir -p /data/uploads` — ensure the target exists on the disk.
3. `ln -s /data/uploads public/uploads` — symlink the name to the disk.
4. `npm run start` — `strapi start`.

The symlink is what makes uploaded photos land on the persistent disk instead of the
ephemeral app folder.

**Why `rm -rf` comes first (not optional):** `public/uploads` exists as a real
directory in the repo (it ships a `.gitkeep`). If you run `ln -s /data/uploads
public/uploads` while that real directory still exists, `ln` puts the link _inside_
it (`public/uploads/uploads`) instead of replacing it — so uploads keep writing to the
ephemeral folder and vanish on redeploy. Deleting the real folder first lets the
symlink take the name.

### Caveat: `strapi transfer` breaks the symlink

The `startCommand` symlink covers every normal case (admin uploads, redeploys). But a
known Strapi 5 bug ([strapi#17779](https://github.com/strapi/strapi/issues/17779)):
a `strapi transfer` / `import` **into** this instance _deletes_ the `public/uploads`
symlink and replaces it with a real folder, so incoming images land on ephemeral
storage — not `/data`. This is exactly the migration path from Cloud, and part of why
images were lost. The cutover step adds a **one-time manual reconciliation** right
after the transfer: move the transferred images onto `/data` and restore the symlink.

> Day-to-day, the symlink is robust. Only the migration needs this extra step. An
> external media provider (Cloudinary/S3) would collapse both DB and uploads into one
> mechanism, but that's out of scope for this disk-based build.

## Secrets — generated vs shared

The env vars fall into two groups:

- **Generated** (`generateValue: true`) — internal to Strapi; nothing outside needs
  their value, so Render mints each once and reuses it across deploys:
  `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`,
  `JWT_SECRET`, `ENCRYPTION_KEY`.
- **Shared** (`sync: false`) — a contract with the Vercel frontend, set by hand in the
  dashboard because Render can't guess an external value:
  - `CLIENT_URL` — the Vercel frontend URL (used by `config/admin.ts` as the preview
    `allowedOrigins` and the preview redirect base).
  - `PREVIEW_SECRET` — must equal the value Vercel's `/api/preview` route checks. A
    Render-random value wouldn't match → every preview would 401.

## References

- Course lesson: `strapi-deploy-render/lessons/0002-prepare-repo-render-yaml.html`
- [render-examples/strapi-sqlite](https://github.com/render-examples/strapi-sqlite) — Render's official SQLite Strapi example
- [Render Blueprint spec](https://render.com/docs/blueprint-spec)
- [strapi#17779](https://github.com/strapi/strapi/issues/17779) — transfer deletes uploads symlink
