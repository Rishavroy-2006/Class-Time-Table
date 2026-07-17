import glob
import re

html_files = glob.glob('*.html')
for file in html_files:
    with open(file, 'r') as f:
        content = f.read()
    
    # Replace href="css/styles.css" with href="css/styles.css?v=2"
    content = re.sub(r'href="css/styles\.css(\?v=\d+)?"', 'href="css/styles.css?v=2"', content)
    
    with open(file, 'w') as f:
        f.write(content)
