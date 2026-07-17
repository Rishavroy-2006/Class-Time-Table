import re
import glob

# 1. Add settings.html to routes in app.js
with open('js/app.js', 'r') as f:
    app_js = f.read()

app_js = app_js.replace(
    '"exams": "exams.html"',
    '"exams": "exams.html",\n  "settings": "settings.html"'
)

with open('js/app.js', 'w') as f:
    f.write(app_js)

# 2. Extract shell from index.html
with open('index.html', 'r') as f:
    index_html = f.read()

head = index_html.split('<body')[0] + '<body class="bg-surface text-on-surface font-body-lg min-h-screen flex flex-col md:flex-row">\n'

# Extract everything before main
before_main = re.search(r'(.*?)(?=<main )', index_html.split('<body class="bg-surface text-on-surface font-body-lg min-h-screen flex flex-col md:flex-row">')[1], re.DOTALL).group(1)

# Extract everything after main
after_main = re.search(r'(</main>.*)', index_html, re.DOTALL).group(1)

main_content = """<main class="flex-grow md:ml-64 p-gutter md:p-container-padding max-w-[1200px] mx-auto w-full pb-24 md:pb-container-padding">
<div class="max-w-[800px] mx-auto py-stack-lg space-y-stack-lg">
<!-- Header -->
<div>
<h2 class="font-display-lg text-display-lg text-primary mb-unit">Settings</h2>
<p class="font-body-lg text-body-lg text-on-surface-variant">Manage your account preferences and app configuration.</p>
</div>
<!-- Profile Settings Card -->
<section class="bg-surface-container-lowest border border-outline-variant rounded-xl p-container-padding">
<h3 class="font-title-sm text-title-sm text-primary mb-stack-md flex items-center gap-2 border-b border-outline-variant pb-2">
<span class="material-symbols-outlined">person</span>
                    Profile Settings
                </h3>
<div class="flex flex-col sm:flex-row gap-stack-lg">
<div class="flex-shrink-0">
<div class="relative w-24 h-24">
<img alt="Alex Mercer" class="w-full h-full rounded-full object-cover border-2 border-surface-container-highest" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAemjVRmM0M9-I2M2LUduuxbpthclYEcWQeMc418RefcACS__l50gXqlmP9X4cuNixsfEuSbTeeOHRMg-SmSkZxOYbVVhwBzDHFuA-MsO7r1DMlHMQ8Mryhok-hWQfE6jBj9wYrZr9qt0MCl13exMq4Nl8G224LEfxVwrHt0A2b4tmv1mBIMxbsIsFimAFk9wB4uySL7Xfui3jQKIXlHyG7xYpGriDcV-4XWuq-W53GR5S10R6YSmTN3D2-J-BxKu-klCnMZoFSLME"/>
<button class="absolute bottom-0 right-0 bg-primary-container text-on-primary-container p-1 rounded-full shadow-sm hover:bg-surface-tint transition-colors">
<span class="material-symbols-outlined" style="font-size: 16px;">edit</span>
</button>
</div>
</div>
<div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-stack-md">
<div>
<label class="block font-label-caps text-label-caps text-on-surface-variant mb-unit">Full Name</label>
<input class="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 font-body-lg text-body-lg text-on-surface focus:outline-none focus:border-primary focus:border-2 transition-all" type="text" value="Alex Mercer"/>
</div>
<div>
<label class="block font-label-caps text-label-caps text-on-surface-variant mb-unit">Email</label>
<input class="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 font-body-lg text-body-lg text-on-surface focus:outline-none focus:border-primary focus:border-2 transition-all" type="email" value="alex.mercer@university.edu"/>
</div>
<div>
<label class="block font-label-caps text-label-caps text-on-surface-variant mb-unit">Student ID</label>
<input class="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 font-mono-label text-mono-label text-on-surface-variant cursor-not-allowed" readonly="" type="text" value="987654321"/>
</div>
<div>
<label class="block font-label-caps text-label-caps text-on-surface-variant mb-unit">Major</label>
<input class="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 font-body-lg text-body-lg text-on-surface focus:outline-none focus:border-primary focus:border-2 transition-all" type="text" value="Computer Science"/>
</div>
</div>
</div>
</section>
<!-- Save Action -->
<div class="flex justify-end pt-stack-md">
<button class="bg-primary text-on-primary font-title-sm text-title-sm py-3 px-6 rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
                    Save Changes
                </button>
</div>
</div>
"""

settings_html = head + before_main + main_content + after_main

# Set title
settings_html = re.sub(r'<title>.*?</title>', '<title>StudyHall - Settings</title>', settings_html)

# Remove active state from Dashboard and make settings active
settings_html = re.sub(
    r'<a class="flex items-center gap-stack-md bg-secondary-container text-on-secondary-container([^>]*)href="index.html">',
    r'<a class="flex items-center gap-stack-md text-on-surface-variant px-stack-md py-stack-sm hover:bg-surface-container-high transition-colors cursor-pointer transition-transform duration-150 active:scale-[0.98] rounded-xl" href="index.html">',
    settings_html
)
settings_html = settings_html.replace('style="font-variation-settings: \'FILL\' 1;"', '')

# Make Settings active in sidebar
settings_html = re.sub(
    r'<a class="flex items-center gap-stack-md text-on-surface-variant px-stack-md py-stack-sm hover:bg-surface-container-high transition-colors rounded-xl" href="#">\s*<span class="material-symbols-outlined">settings</span>\s*<span class="font-title-sm text-title-sm">Settings</span>\s*</a>',
    r'<a class="flex items-center gap-stack-md bg-secondary-container text-on-secondary-container rounded-xl px-stack-md py-stack-sm cursor-pointer transition-transform duration-150 active:scale-[0.98]" href="settings.html">\n          <span class="material-symbols-outlined" style="font-variation-settings: \'FILL\' 1;">settings</span>\n          <span class="font-title-sm text-title-sm">Settings</span>\n        </a>',
    settings_html
)
# Update hrefs for settings in other files
html_files = glob.glob('*.html')
for file in html_files:
    with open(file, 'r') as f:
        content = f.read()
    content = re.sub(
        r'<a class="flex items-center gap-stack-md text-on-surface-variant px-stack-md py-stack-sm hover:bg-surface-container-high transition-colors rounded-xl" href="#">\s*<span class="material-symbols-outlined">settings</span>\s*<span class="font-title-sm text-title-sm">Settings</span>\s*</a>',
        r'<a class="flex items-center gap-stack-md text-on-surface-variant px-stack-md py-stack-sm hover:bg-surface-container-high transition-colors rounded-xl" href="settings.html">\n          <span class="material-symbols-outlined">settings</span>\n          <span class="font-title-sm text-title-sm">Settings</span>\n        </a>',
        content
    )
    with open(file, 'w') as f:
        f.write(content)

with open('settings.html', 'w') as f:
    f.write(settings_html)
