# 📸 Screenshots Directory

Place your Vitalis OS screenshots here with the following names:

## Required Screenshots

1. **`login.png`** - The login/authentication screen
2. **`dashboard-sidebar.png`** - The main sidebar with navigation menu
3. **`patient-registry.png`** - Patient registry card showing patient info
4. **`ai-diagnostics.png`** - Patient detail view with vitals and AI diagnostic engine
5. **`ai-insights-stream.png`** - Live AI insights stream with critical alerts

## Image Guidelines

- **Format:** PNG (for transparency) or JPG
- **Resolution:** 1920x1080 or higher recommended
- **Aspect Ratio:** Maintain original UI proportions
- **File Size:** Optimize to < 500KB per image
- **Naming:** Use lowercase with hyphens (kebab-case)

## How to Add Screenshots

### Option 1: Using GitHub Web Interface
1. Navigate to `docs/screenshots/` in your GitHub repository
2. Click **"Add file"** → **"Upload files"**
3. Drag and drop your 5 screenshots
4. Commit with message: `docs: add application screenshots`

### Option 2: Using Git Command Line
```bash
# From project root
cd docs/screenshots/

# Copy your screenshots here (rename them accordingly)
cp ~/Downloads/screenshot1.png ./login.png
cp ~/Downloads/screenshot2.png ./dashboard-sidebar.png
cp ~/Downloads/screenshot3.png ./patient-registry.png
cp ~/Downloads/screenshot4.png ./ai-diagnostics.png
cp ~/Downloads/screenshot5.png ./ai-insights-stream.png

# Commit and push
git add .
git commit -m "docs: add application screenshots"
git push origin main
```

## Screenshot Optimization (Optional)

To reduce file sizes while maintaining quality:

```bash
# Using ImageMagick
convert input.png -quality 85 -resize 1920x1080\> output.png

# Using pngquant
pngquant --quality=85-95 --ext .png --force *.png
```

## Current Status

- [ ] `login.png`
- [ ] `dashboard-sidebar.png`
- [ ] `patient-registry.png`
- [ ] `ai-diagnostics.png`
- [ ] `ai-insights-stream.png`

Once all screenshots are uploaded, the README.md will display them automatically!

