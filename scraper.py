import requests
from bs4 import BeautifulSoup

from csv import writer

# books with most number of translations
# language with most number of translations
# interactive with start and end years
# with slider for year
def is_line_break(cell):
    return cell != "\n"


def get_book_list():
    book_list = []
    j = 0
    for row in data_table_rows:
        if j == 0:
            j += 1
            continue
        else:
            book = {}
            # cells = row.contents
            # print(cells)
            cells = filter(is_line_break, row.contents)

            i = 0
            for cell in cells:
                if i == 0:
                    book["title"] = cell.get_text()
                elif i == 1:
                    # list of authors
                    book["authors"] = cell.get_text()
                elif i == 2:
                    book["date"] = cell.get_text()
                # list of translations
                # different version translation ie bible
                # less than or greater than in front of numbers
                elif i == 3:
                    book["number_of_translations"] = cell.get_text()
                # list of languages
                elif i == 4:
                    book["original_language"] = cell.get_text().strip()
                i += 1
            book_list.append(book)

    return book_list


response = requests.get(
    "https://en.wikipedia.org/wiki/List_of_literary_works_by_number_of_translations"
)
soup = BeautifulSoup(response.text, "html.parser")
data_table_rows = soup.select(".wikitable tr")
book_dict_list = get_book_list()

with open(
    "books_for_hackathon.csv", encoding="utf-8", mode="w", newline=""
) as csv_file:
    csv_writer = writer(csv_file)
    csv_writer.writerow(
        ["Title", "Authors", "Date", "Number of Translations", "Original Language"]
    )

    for book in book_dict_list:
        csv_writer.writerow(
            [
                book["title"],
                book["authors"],
                book["date"],
                book["number_of_translations"],
                book["original_language"],
            ]
        )
