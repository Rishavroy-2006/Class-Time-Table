import re
import os

def fix_file(filename, target_href):
    with open(filename, 'r') as f:
        html = f.read()

    # Fix the \'FILL\' issue
    html = html.replace("\\'FILL\\'", "'FILL'")
    
    # Force set the active background for Desktop
    # First, make sure the target has the active classes
    inactive_class = 'text-on-surface-variant px-stack-md py-stack-sm hover:bg-surface-container-high transition-colors cursor-pointer transition-transform duration-150 active:scale-[0.98] rounded-xl'
    active_class = 'bg-secondary-container text-on-secondary-container rounded-xl px-stack-md py-stack-sm cursor-pointer transition-transform duration-150 active:scale-[0.98]'
    
    # We will just replace the a tag directly
    html = re.sub(
        r'<a class="flex items-center gap-stack-md text-on-surface-variant [^"]*" href="' + re.escape(target_href) + r'">',
        f'<a class="flex items-center gap-stack-md {active_class}" href="{target_href}">',
        html
    )

    with open(filename, 'w') as f:
        f.write(html)
    print(f"Fixed {filename}")

fix_file('timetable.html', 'timetable.html')
fix_file('courses.html', 'courses.html')
fix_file('tasks.html', 'tasks.html')
fix_file('exams.html', 'exams.html')
