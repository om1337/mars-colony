# Mars Colony · Resource Ledger

## Run

Guest WiFi SSL workaround is required for `npm install`:

```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 npm install
# If node_modules corrupts under Documents/, install to /tmp and symlink:
# NODE_TLS_REJECT_UNAUTHORIZED=0 npm install --prefix /tmp/mars-colony-deps
# ln -sfn /tmp/mars-colony-deps/node_modules ./node_modules

npm run dev
# or: node node_modules/next/dist/bin/next dev -p 3000
```

Open [http://localhost:3000](http://localhost:3000) — Week Board is the home screen.

## Status

- Tier 1 Week Board: live (resources × 7 days, collisions, reserve floors, ghosted in-transit, filters)
