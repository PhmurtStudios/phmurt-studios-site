# Cloudflare Security Configuration Guide
## Phmurt Studios — Audit Findings V-M3 & V-M2

These two fixes require Cloudflare dashboard configuration since GitHub Pages has no server-side config.

---

## Fix 1: Block package.json & package-lock.json (V-M3)

These files are served publicly (HTTP 200) and expose dependency information to attackers.

### Option A: Cloudflare WAF Custom Rule (Recommended)

1. Go to **Cloudflare Dashboard** → your domain → **Security** → **WAF** → **Custom rules**
2. Click **Create rule**
3. Configure:
   - **Rule name:** `Block package files`
   - **Expression:** Use "Edit expression" and paste:
     ```
     (http.request.uri.path eq "/package.json") or (http.request.uri.path eq "/package-lock.json")
     ```
   - **Action:** `Block`
4. Click **Deploy**

### Option B: Delete from GitHub repo

If `package.json` and `package-lock.json` aren't needed for any build process:
1. Delete them from the repo entirely
2. Add to `.gitignore`:
   ```
   package.json
   package-lock.json
   ```

---

## Fix 2: Add Security Headers (V-M2)

### Cloudflare Transform Rules

1. Go to **Cloudflare Dashboard** → your domain → **Rules** → **Transform Rules** → **Modify Response Header**
2. Click **Create rule**
3. Configure:
   - **Rule name:** `Security headers`
   - **When:** `All incoming requests` (or use expression: `(http.host eq "phmurtstudios.com")`)
   - **Then → Set response headers:**

| Operation | Header Name | Value |
|-----------|------------|-------|
| Set | `X-Frame-Options` | `DENY` |
| Set | `X-Content-Type-Options` | `nosniff` |
| Set | `Referrer-Policy` | `strict-origin-when-cross-origin` |
| Set | `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |

4. Click **Deploy**

### Verification

After deploying both rules, verify with:
```bash
# Should return 403 or block page
curl -I https://phmurtstudios.com/package.json

# Should show security headers
curl -I https://phmurtstudios.com/ | grep -iE "x-frame|x-content|referrer-policy|permissions-policy"
```

---

## Optional: Cloudflare Access for /admin (V-C1 Enhancement)

For an additional layer on the admin page, you can put it behind Cloudflare Access:

1. Go to **Cloudflare Dashboard** → **Zero Trust** → **Access** → **Applications**
2. Click **Add an application** → **Self-hosted**
3. Configure:
   - **Application name:** `Phmurt Admin`
   - **Application domain:** `phmurtstudios.com`
   - **Path:** `/admin.html`
   - **Policy:** Allow your email address only
4. This adds a Cloudflare login screen before the page even loads

This is optional since Supabase auth is already the real security gate.
