# -*- coding: utf-8 -*-

from pymongo import MongoClient
from datetime import datetime

client = MongoClient()
db = client.douban
this_year = datetime(2019, 1, 1)

items = []


def gen_item(book_or_movie, tp):
    for item in book_or_movie.find({"date": {"$gte": this_year}}):
        item['tips'] = "读过" if tp == "book" else "看过"
        items.append(item)


def fmt_output():
    opt = "{{% figure '{}' '{}' '{}' '{}' %}}"
    for item in items:
        print(opt.format(item['cover'], item['title'],
                         item['url'],
                         item['date'].strftime('%Y-%m-%d ') + item['tips']))


if __name__ == "__main__":
    movies = db.Movie
    books = db.Book
    gen_item(movies, 'movie')
    gen_item(books, 'book')
    items.sort(key=lambda x: x['date'], reverse=True)
    fmt_output()


