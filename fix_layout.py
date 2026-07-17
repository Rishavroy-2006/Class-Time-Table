import os
import re

def get_file_content(filepath):
    with open(filepath, 'r') as f:
        return f.read()

def write_file_content(filepath, content):
    with open(filepath, 'w') as f:
        f.write(content)

index_html = get_file_content('index.html')

# Extract standardized components from index.html
head_match = re.search(r'(<head>.*?</head>)', index_html, re.DOTALL)
desktop_sidenav_match = re.search(r'(<!-- Desktop SideNav -->.*?</nav>)', index_html, re.DOTALL)
mobile_top_app_bar_match = re.search(r'(<!-- Top App Bar for Mobile -->.*?</header>)', index_html, re.DOTALL)
mobile_bottom_nav_match = re.search(r'(<!-- Mobile Bottom Nav -->.*?</nav>)', index_html, re.DOTALL)

desktop_sidenav = desktop_sidenav_match.group(1)
mobile_top_app_bar = mobile_top_app_bar_match.group(1)
mobile_bottom_nav = mobile_bottom_nav_match.group(1)

def update_file(filename, active_tab_name, active_tab_href):
    print(f"Updating {filename}...")
    content = get_file_content(filename)
    
    # 1. Fix body tag
    content = re.sub(r'<body[^>]*>', '<body class="bg-surface text-on-surface font-body-lg min-h-screen flex flex-col md:flex-row">', content)
    
    # 2. Remove wrapper <div class="flex"> if it exists
    if '<div class="flex">' in content:
        content = content.replace('<div class="flex">', '', 1)
        # Need to remove one closing </div> before bottom nav. We will just replace everything between </main> and bottom nav.
        content = re.sub(r'</main>\s*</div>\s*<!--', '</main>\n\n  <!--', content)
    
    # 3. Replace Desktop SideNav
    # Some use <aside>, some use <nav>
    content = re.sub(r'<!-- SideNavBar Desktop -->.*?</aside>', desktop_sidenav, content, flags=re.DOTALL)
    content = re.sub(r'<!-- Desktop SideNav -->.*?</nav>', desktop_sidenav, content, flags=re.DOTALL)
    
    # 4. Mobile Top App Bar
    # If not exists, insert before main
    if '<!-- Top App Bar for Mobile -->' not in content:
        content = re.sub(r'(<main )', f'{mobile_top_app_bar}\n\n  \\1', content)
    else:
        content = re.sub(r'<!-- Top App Bar for Mobile -->.*?</header>', mobile_top_app_bar, content, flags=re.DOTALL)

    # 5. Replace Mobile Bottom Nav
    # Some use <nav class="md:hidden...
    content = re.sub(r'<!-- BottomNavBar Mobile -->.*?</nav>', mobile_bottom_nav, content, flags=re.DOTALL)
    content = re.sub(r'<!-- Mobile Bottom Nav -->.*?</nav>', mobile_bottom_nav, content, flags=re.DOTALL)
    
    # 6. Fix main tag classes
    content = re.sub(r'<main[^>]*>', '<main class="flex-grow md:ml-64 p-gutter md:p-container-padding max-w-[1200px] mx-auto w-full pb-24 md:pb-container-padding">', content)

    # 7. Set Active Tab in Desktop SideNav
    # We replace the active state on the matched tab, and remove it from index.html tab
    
    def set_active_desktop(html, target_href):
        # Reset all tabs to inactive first
        html = re.sub(r'bg-secondary-container text-on-secondary-container', 'text-on-surface-variant hover:bg-surface-container-high transition-colors', html)
        html = re.sub(r'style="font-variation-settings: \'FILL\' 1;"', '', html)
        
        # Now find the target and set it active
        # <a class="... text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer transition-transform duration-150 active:scale-[0.98] rounded-xl" href="target_href">
        # => bg-secondary-container text-on-secondary-container ...
        
        pattern = r'(<a[^>]*text-on-surface-variant hover:bg-surface-container-high transition-colors([^>]*) href="' + re.escape(target_href) + r'")'
        replacement = r'<a class="flex items-center gap-stack-md bg-secondary-container text-on-secondary-container rounded-xl px-stack-md py-stack-sm cursor-pointer transition-transform duration-150 active:scale-[0.98]" href="' + target_href + '"'
        
        html = re.sub(r'<a class="flex items-center gap-stack-md text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer transition-transform duration-150 active:scale-\[0\.98\] rounded-xl" href="' + re.escape(target_href) + r'">',
                      r'<a class="flex items-center gap-stack-md bg-secondary-container text-on-secondary-container rounded-xl px-stack-md py-stack-sm cursor-pointer transition-transform duration-150 active:scale-[0.98]" href="' + target_href + '">', html)
        
        # Add FILL to the icon
        icon_pattern = r'(href="' + re.escape(target_href) + r'">\s*<span class="material-symbols-outlined")'
        html = re.sub(icon_pattern, r'\1 style="font-variation-settings: \'FILL\' 1;"', html)
        
        return html

    def set_active_mobile(html, target_href):
        # Reset all to inactive
        html = re.sub(r'bg-primary-container text-on-primary-container', 'text-on-surface-variant active:bg-surface-container-high', html)
        html = re.sub(r'style="font-variation-settings: \'FILL\' 1;"', '', html)
        
        # Set target to active
        target_a_pattern = r'<a class="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 active:bg-surface-container-high([^"]*)" href="' + re.escape(target_href) + r'">'
        replacement = r'<a class="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1 transition-all duration-200 active:scale-90" href="' + target_href + '">'
        html = re.sub(target_a_pattern, replacement, html)
        
        # Add FILL
        icon_pattern = r'(href="' + re.escape(target_href) + r'">\s*<span class="material-symbols-outlined [^"]*")'
        html = re.sub(icon_pattern, r'\1 style="font-variation-settings: \'FILL\' 1;"', html)
        return html

    content = set_active_desktop(content, active_tab_href)
    content = set_active_mobile(content, active_tab_href)
    
    write_file_content(filename, content)
    print(f"Finished {filename}")

update_file('timetable.html', 'Weekly', 'timetable.html')
update_file('courses.html', 'Courses', 'courses.html')
update_file('tasks.html', 'Tasks', 'tasks.html')
update_file('exams.html', 'Exams', 'exams.html')

print("All done.")
