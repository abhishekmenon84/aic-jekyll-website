# 🍁 AIC Fredericton — Jekyll Website

**Association of Indo-Canadians, Fredericton, NB**  
🌐 [aicfred.org](https://aicfred.org) · Built with [Jekyll](https://jekyllrb.com) · Hosted on [GitHub Pages](https://pages.github.com)

---

## 📁 Project Structure

```
aic-fred-website/
│
├── _config.yml              ← ⚙️  Site settings (name, email, social links)
│
├── _data/                   ← ✏️  ALL DYNAMIC CONTENT — edit these YAML files!
│   ├── executives.yml       ← Board members & executive team
│   ├── upcoming_events.yml  ← Current/future events
│   ├── past_events.yml      ← Completed events (move from upcoming here)
│   ├── volunteers.yml       ← Volunteer roles
│   └── navigation.yml       ← Nav menu links
│
├── _layouts/                ← Page templates (don't edit unless styling)
│   ├── default.html
│   └── page.html
│
├── _includes/               ← Reusable components
│   ├── nav.html
│   ├── footer.html
│   ├── event_card.html
│   └── section_header.html
│
├── assets/
│   ├── css/main.css         ← All styles
│   ├── js/main.js           ← All JavaScript
│   └── images/
│       └── logo.jpeg        ← AIC Logo
│
├── index.md                 ← 🏠 Homepage
├── events/index.md          ← 📅 Events page
├── executives/index.md      ← 👥 Executives page
├── volunteer/index.md       ← 🤝 Volunteer page
│
├── CNAME                    ← Custom domain: aicfred.org
├── Gemfile                  ← Ruby dependencies
└── .gitignore
```

---

## ✏️ How to Update Content (No Coding Needed!)

All dynamic content lives in the `_data/` folder as **YAML files**. Just edit and push!

### ➕ Add an Upcoming Event (`_data/upcoming_events.yml`)
```yaml
- title: "Eid Celebration 2026"
  date: "2026-04-01"
  time: "5:00 PM – 9:00 PM"
  location: "AIC Community Hall, Fredericton"
  description: "Join us for a joyful Eid celebration with food, prayer, and community."
  category: "Cultural"        # Cultural | Gala | Community | Arts | Education | Sports
  emoji: "🌙"
  featured: true              # true = shows on homepage
  register_url: "https://forms.gle/YOUR_FORM_LINK"
  image: ""
```

### 📦 Move Event to Past (`_data/past_events.yml`)
When an event is over, move it here:
```yaml
- title: "Eid Celebration 2026"
  date: "2026-04-01"
  location: "AIC Community Hall, Fredericton"
  category: "Cultural"
  emoji: "🌙"
  attendees: 95
  highlights:
    - "95 community members celebrated together"
    - "Traditional iftar dinner"
  image: ""
```

### 👤 Add/Update an Executive (`_data/executives.yml`)
```yaml
- name: "New Person"
  role: "Director at Large"
  photo: ""                    # or "/assets/images/team/name.jpg"
  bio: "Short bio here."
  email: "role@aicfred.org"
  linkedin: ""
  term: "2026–2028"
  active: true                 # false = moves to "Past Executives" section
```

**To add a photo:** Upload to `assets/images/team/` and set `photo: "/assets/images/team/filename.jpg"`

### 🙋 Add a Volunteer Role (`_data/volunteers.yml`)
```yaml
- title: "Photography"
  emoji: "📷"
  description: "Capture memories at AIC events."
  commitment: "Event-based"
  spots_available: 2           # or null for unlimited
  skills_needed:
    - "DSLR or mirrorless camera"
    - "Basic editing skills"
  contact: "comms@aicfred.org"
```

### 🔗 Connect Google Form
1. Go to [forms.google.com](https://forms.google.com) → create form → **Send → Link**
2. In `_config.yml`, replace:
   ```yaml
   volunteer_form_url: "https://forms.gle/REPLACE_WITH_YOUR_FORM"
   ```
3. Also update `register_url` in each event in `_data/upcoming_events.yml`

---

## 🚀 Deploy to GitHub Pages

### Step 1 — Create Repository
1. Go to [github.com](https://github.com) → **New repository**
2. Name: `aic-fred-website` (or any name)
3. Visibility: **Public**
4. Click **Create repository**

### Step 2 — Upload Files
**Option A — Web upload (simplest):**
- GitHub repo → **Add file → Upload files** → drag all files → commit

**Option B — Git CLI:**
```bash
git init
git add .
git commit -m "Launch AIC Fredericton website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/aic-fred-website.git
git push -u origin main
```

### Step 3 — Enable GitHub Pages
1. Repo → **Settings → Pages**
2. Source: **GitHub Actions** (for Jekyll) OR **Deploy from branch** → `main`
3. If using **Deploy from branch**: GitHub will auto-detect Jekyll and build it!

> 💡 GitHub Pages natively supports Jekyll — no build step needed. Just push and it deploys!

### Step 4 — Custom Domain
1. In **Settings → Pages → Custom domain**, enter: `aicfred.org` → Save
2. At your domain registrar, add these DNS records:

| Type  | Name  | Value                    |
|-------|-------|--------------------------|
| A     | @     | `185.199.108.153`        |
| A     | @     | `185.199.109.153`        |
| A     | @     | `185.199.110.153`        |
| A     | @     | `185.199.111.153`        |
| CNAME | `www` | `YOUR_USERNAME.github.io`|

3. Check **Enforce HTTPS** ✅

> ⏳ DNS propagation takes up to 48 hours.

---

## 🛠️ Run Locally (Optional)

```bash
# Install Ruby (if not installed)
# macOS: brew install ruby
# Ubuntu: sudo apt install ruby-full

gem install jekyll bundler
bundle install
bundle exec jekyll serve
# Open http://localhost:4000
```

---

## 🆓 Recommended Free Tools

| Tool | Purpose | Link |
|------|---------|-------|
| **VS Code** | Edit YAML/HTML files | [code.visualstudio.com](https://code.visualstudio.com) |
| **GitHub Desktop** | Push changes without CLI | [desktop.github.com](https://desktop.github.com) |
| **Google Forms** | Volunteer & event registration | [forms.google.com](https://forms.google.com) |
| **Canva** | Design event graphics | [canva.com](https://canva.com) |
| **Squoosh** | Compress images for web | [squoosh.app](https://squoosh.app) |
| **Google Analytics** | Track visitors | [analytics.google.com](https://analytics.google.com) |
| **Mailchimp** (free ≤500) | Email newsletter | [mailchimp.com](https://mailchimp.com) |

---

*Made with ❤️ for the Indo-Canadian community in Fredericton, NB*  
*🇮🇳 🤝 🇨🇦*
