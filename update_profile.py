import re
import glob

# 1. Update sidebars in all HTML files
html_files = glob.glob('*.html')
for file in html_files:
    with open(file, 'r') as f:
        content = f.read()

    # The sidebar profile section looks like this:
    # <div class="w-10 h-10 rounded-full object-cover border border-outline-variant bg-secondary-container flex items-center justify-center">
    #   <span class="material-symbols-outlined text-on-secondary-container">person</span>
    # </div>
    # <div>
    #   <h2 class="font-title-sm text-title-sm text-on-surface">Academic Year 2024</h2>
    #   <p class="font-body-sm text-body-sm text-on-surface-variant">Semester 2</p>
    # </div>

    # We will replace it with a standard identifiable block
    old_profile = r'<div class="flex items-center gap-2 mt-4">\s*<div class="w-10 h-10 rounded-full object-cover border border-outline-variant bg-secondary-container flex items-center justify-center">\s*<span class="material-symbols-outlined text-on-secondary-container">person</span>\s*</div>\s*<div>\s*<h2 class="font-title-sm text-title-sm text-on-surface">Academic Year 2024</h2>\s*<p class="font-body-sm text-body-sm text-on-surface-variant">Semester 2</p>\s*</div>\s*</div>'
    
    new_profile = """<div class="flex items-center gap-2 mt-4">
        <div class="relative w-10 h-10 rounded-full object-cover border border-outline-variant bg-secondary-container overflow-hidden flex items-center justify-center">
          <img class="sidebar-pic w-full h-full object-cover hidden" src="" alt="Profile" />
          <span class="sidebar-icon material-symbols-outlined text-on-secondary-container">person</span>
        </div>
        <div>
          <h2 class="sidebar-name font-title-sm text-title-sm text-on-surface">Student Name</h2>
          <p class="sidebar-major font-body-sm text-body-sm text-on-surface-variant">Department</p>
        </div>
      </div>"""
    
    content = re.sub(old_profile, new_profile, content)
    
    with open(file, 'w') as f:
        f.write(content)

# 2. Update settings.html main content
with open('settings.html', 'r') as f:
    settings = f.read()

settings = re.sub(r'value="Alex Mercer"', 'placeholder="e.g. Alex Mercer" id="settingsName"', settings)
settings = re.sub(r'value="alex.mercer@university.edu"', 'placeholder="e.g. alex.mercer@university.edu" id="settingsEmail"', settings)
# Make Student ID editable and add placeholder
settings = re.sub(r'readonly="" type="text" value="987654321"', 'type="text" placeholder="e.g. 987654321" id="settingsId"', settings)
settings = settings.replace('cursor-not-allowed', '')
settings = settings.replace('bg-surface-container-low', 'bg-surface')

settings = re.sub(r'value="Computer Science"', 'placeholder="e.g. Computer Science" id="settingsMajor"', settings)

# Picture
settings = re.sub(
    r'<img alt="Alex Mercer" class="w-full h-full rounded-full object-cover border-2 border-surface-container-highest" src="[^"]*"/>',
    r'<img id="settingsPic" class="w-full h-full rounded-full object-cover border-2 border-surface-container-highest hidden" src="" alt="Profile"/><div id="settingsPicPlaceholder" class="w-full h-full rounded-full border-2 border-surface-container-highest bg-secondary-container flex items-center justify-center"><span class="material-symbols-outlined text-[32px] text-on-secondary-container">person</span></div>',
    settings
)

# Edit button
settings = re.sub(
    r'<button class="absolute bottom-0 right-0 bg-primary-container text-on-primary-container p-1 rounded-full shadow-sm hover:bg-surface-tint transition-colors">',
    r'<button id="settingsEditPicBtn" class="absolute bottom-0 right-0 bg-primary-container text-on-primary-container p-1 rounded-full shadow-sm hover:bg-primary-fixed-dim transition-colors cursor-pointer">\n<input type="file" id="settingsPicInput" accept="image/*" class="hidden">',
    settings
)

# Save button
settings = re.sub(
    r'<button class="bg-primary text-on-primary font-title-sm text-title-sm py-3 px-6 rounded-xl hover:bg-primary/90 transition-colors shadow-sm">\s*Save Changes\s*</button>',
    r'<button id="settingsSaveBtn" class="bg-primary text-on-primary font-title-sm text-title-sm py-3 px-6 rounded-xl hover:bg-primary/90 transition-colors shadow-sm">\n                    Save Changes\n                </button>',
    settings
)

with open('settings.html', 'w') as f:
    f.write(settings)

