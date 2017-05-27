import requests
from bs4 import BeautifulSoup
import re
url = 'https://ytuce.maliayas.com/'
r  = requests.get(url)
soup = BeautifulSoup(r.text, 'html.parser')

for item in soup.find_all('div', 'item'):
    author = item.find('div', 'text_author').find('a')
    title = item.find('div', 'text_title').find('a')
    content = item.find('div', 'text_content').get_text()
    time = re.search('\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}', item.find('span', 'date')['title'])
    data = {
        'authorName': author.get_text(),
        'authorLink': author['href'],
        'titleName': title.get_text(),
        'titleLink': title['href'],
        'content': content,
        'id': id,
        'date': time.group(0)
    }
    print(data)
