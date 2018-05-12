import requests

res = requests.get("https://www.goodreads.com/book/review_counts.json", params={"key": "uf44igLdn7CKCpDscLpg", "isbns": "0375913750"})
data = res.json()
av_rating = data["books"][0]["average_rating"]
wr_count = data["books"][0]["work_ratings_count"]
print("{} & {}".format(av_rating, wr_count))
